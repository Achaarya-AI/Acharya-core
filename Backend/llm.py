import os
from os.path import join
from transformers import BitsAndBytesConfig, AutoModelForCausalLM, AutoTokenizer, pipeline as hf_pipeline
from langchain import HuggingFacePipeline
from langchain.embeddings import SentenceTransformerEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA

# Global variables to store the initialized model and tokenizer
global_model = None
global_tokenizer = None
db = None



# Generating Embeddings from the docs folder
def generate_embeddings():
  from langchain.document_loaders import PyPDFLoader, PDFMinerLoader, DirectoryLoader
  from langchain.embeddings import SentenceTransformerEmbeddings
  from langchain.text_splitter import RecursiveCharacterTextSplitter
  from langchain.vectorstores import Chroma
  from os.path import join
  import os

  global db

  if db is None:
    for root,dir,files in os.walk("docs"):
      for file in files:
          if file.endswith(".pdf"):
              loader = PDFMinerLoader(join(root,file))
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=500)
    texts = text_splitter.split_documents(documents)

    embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    db = Chroma.from_documents(texts, embeddings, persist_directory="db")



def load_model():
  import torch
  from transformers import BitsAndBytesConfig, pipeline
  from langchain import HuggingFacePipeline
  from langchain import PromptTemplate, LLMChain
  from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

  global global_model, global_tokenizer

  if global_model is None or global_tokenizer is None:
    model_id = "OdiaGenAI/mistral_hindi_7b_base_v1"

    quantization_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_use_double_quant=True,
    )

    global_model = AutoModelForCausalLM.from_pretrained(model_id, device_map="auto", quantization_config=quantization_config)
    global_tokenizer = AutoTokenizer.from_pretrained(model_id)




def initialize_model():

  generate_embeddings()
  load_model()

def llm_pipeline():
  pipe = hf_pipeline(
      model=global_model,
      tokenizer=global_tokenizer,
      task="text-generation",
      use_cache=True,
      device_map="auto",
      max_length=2000,
      do_sample=True,
      top_k=5,
      temperature=0.01,
      num_return_sequences=1,
      eos_token_id=global_tokenizer.eos_token_id,
      pad_token_id=global_tokenizer.eos_token_id,
  )
  local_llm = HuggingFacePipeline(pipeline=pipe)
  return local_llm

def qa_llm():
    llm=llm_pipeline()
    embeddings=SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    db=Chroma(persist_directory="db", embedding_function=embeddings)
    retriever=db.as_retriever()
    qa=RetrievalQA.from_chain_type(
      llm=llm,
      chain_type="stuff",
      retriever=retriever,
      return_source_documents=True
    )
    return qa



def generate_response(instruction):
  response=''
  qa=qa_llm()
  generation=qa(instruction)
  answer=generation['result']
  return answer, generation

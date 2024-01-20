import torch
from transformers import BitsAndBytesConfig, AutoModelForCausalLM, AutoTokenizer, pipeline
from langchain import HuggingFacePipeline
from langchain import PromptTemplate, LLMChain
from langchain.globals import set_debug, set_verbose

from langchain.document_loaders import PyPDFLoader, PDFMinerLoader, DirectoryLoader
from langchain.embeddings import SentenceTransformerEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from os.path import join
import os
from constants import CHROMA_SETTINGS

# Global variables to store the initialized model and tokenizer
global_model = None
global_tokenizer = None

def initialize_model():

    global global_model, global_tokenizer

    import torch
    print(torch.version.cuda)

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

        set_debug(False)
        set_verbose(False)

# Function to generate a response using the initialized model and tokenizer
def generate_response(question):
    global global_model, global_tokenizer

    if global_model is None or global_tokenizer is None:
        raise ValueError("Model not initialized. Call initialize_model() first.")

    pipeline = pipeline(
        "text-generation",
        model=global_model,
        tokenizer=global_tokenizer,
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

    llm = HuggingFacePipeline(pipeline=pipeline)

    template = """### System:\nBelow is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.\n\n\n\n### Instruction:\n{question}\n\n### Input:\n{context}\n\n### Response:\n"""
    prompt = PromptTemplate(template=template, input_variables=["question", "context"])
    llm_chain = LLMChain(prompt=prompt, llm=llm)
    context = ""
    response = llm_chain.run({"question": question, "context": context})
    return response

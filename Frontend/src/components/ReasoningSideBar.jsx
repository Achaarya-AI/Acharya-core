import CloseIcon from '@mui/icons-material/Close';

export default function ReasoningSideBar({ isToggleOpen, handleCloseToggle, reasoningArray }) {
  return (
    <div className={`sidebar ${isToggleOpen ? "toggle-open" : "toggle-close"} px-5 py-6`}>
      <div className='flex justify-between'>
        <h1 className="text-white font-semibold text-xl">Why this response</h1>
        <button onClick={() => handleCloseToggle()}><CloseIcon className="text-white h-full" /></button>
      </div>
      <div className="mt-4">
        {reasoningArray.map((item, index) => (
          <div key={index} className="mb-4">
            <p className="text-white mb-2 text-justify">{item.page_content}</p>
            <p className="text-gray-500 text-sm text-right">{`Source: ${item.metadata.source}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

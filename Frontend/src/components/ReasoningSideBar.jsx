import CloseIcon from '@mui/icons-material/Close';

export default function ReasoningSideBar({ isToggleOpen, handleCloseToggle, reasoningArray, themeColors }) {
  return (
    <div className={`sidebar z-20 ${themeColors.reasonbg} ${isToggleOpen ? "toggle-open" : "toggle-close"} px-5 py-6`} >
      <div className='flex justify-between'>
        <h1 className={`${themeColors.txt} font-semibold text-xl`}>Why this response</h1>
        <button onClick={() => handleCloseToggle()}><CloseIcon className={`${themeColors.txt} h-full`} /></button>
      </div>
      <div className="mt-4">
        {reasoningArray.map((item, index) => (
          <div key={index} className="mb-4">
            <p className={`${themeColors.txt} mb-2 text-justify`}>{item.page_content}</p>
            <p className="text-gray-500 text-sm text-right">{`Source: ${item.metadata.source}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

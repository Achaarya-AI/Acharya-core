import CloseIcon from '@mui/icons-material/Close';

export default function ReasoningSideBar({isToggleOpen, handleCloseToggle}) {
    return (
        <div className={`sidebar ${isToggleOpen ? "toggle-open" : "toggle-close"} px-5 py-6`}>
            <div className='flex justify-between'>
                <h1 className="text-white font-semibold text-xl">Why this response</h1>
                <button onClick={() => handleCloseToggle()}><CloseIcon className="text-white h-full" /></button>
            </div>
        </div>
    )
}
import { useAppState } from '../AppStateContext';

const Footer = () => {
    const {darkTheme} = useAppState()

    const themeColors = darkTheme === true ? {
        "bg": "bg-primary-dark",
        "bg2": "bg-secondary-bg-dark",
        "bgs": "bg-secondary",
        "chatbg": "bg-chat-bg-dark",
        "reasonbg": "bg-reason-dark",
        "txt" : "text-white",
        "color": "white",
        "reasonIcon" : "fill-white",
    } : {
        "bg": "bg-primary", 
        "bg2": "bg-secondary-bg",
        "bgs": "bg-secondary",
        "chatbg": "bg-chat-bg",
        "reasonbg": "bg-reason",
        "txt" : "text-reason-dark",
        "color": "black",
        "reasonIcon" : "fill-dark",
    }

    return (
        <div className={`footer flex justify-center ${themeColors.bg2}`}>
            <p className="text-[#808080] pb-2">© 2024 Odia Generative AI</p>
        </div>
    )
}

export default Footer;
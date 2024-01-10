export default function Radio(props) {
    return (
        <div className="inline-flex items-center gap-[20px] mb-[10px]">
            <label className="relative flex items-center ml-[37px]  rounded-full cursor-pointer" htmlFor="html_version">
                <input
                    type="radio"
                    name="contextType"
                    id={props.id}
                    value={props.value}
                    checked={props.checked}
                    onChange={(event) => props.handleConfigChange(event)}
                    disabled={props.disabled}
                    required
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-white text-gray-900 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity checked:border-secondary disabled:border-secondary-bg disabled:bg-primary"
                />
                <span
                    className="absolute text-secondary transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
                        <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                </span>
            </label>
            <label className="text-white cursor-pointer select-none " htmlFor={props.id}>
                <p className="block font-secondary text-white">
                    {props.value}
                </p>
            </label>
        </div>
    )
}


export const radioOptions = [
    { id: "text-radio", value: "text", label: "Text" },
    { id: "url-radio", value: "url", label: "URL" },
    { id: "document-radio", value: "document", label: "Document" },
];
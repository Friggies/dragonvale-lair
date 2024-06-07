export default function LabelInput({ label, children }) {
    return (
        <label className="labelInput">
            {label}
            {children}
        </label>
    )
}

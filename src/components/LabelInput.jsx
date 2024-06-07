export default function LabelInput({ label, children }) {
    return (
        <label className="column column--toRow">
            {label}
            {children}
        </label>
    )
}

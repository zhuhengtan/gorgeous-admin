import React from "react"
import parse from "html-react-parser"
import Editor from "../editor"
interface Props {
  value: string;
  onChange: (v: string) => void;
  readOnly: boolean;
}

const Richtext: React.FC<Props> = (props: Props) => {
  const { readOnly, value, onChange } = props
  if (readOnly) {
    if (!value) {
      return <span>-</span>
    }
    return (
      <div>
        {parse(value)}
      </div>
    )
  }
  return (
    <Editor
      value={value}
      onChange={({ html }) => {
        onChange(html)
      }}
    />
  )
}

export default React.memo(Richtext)

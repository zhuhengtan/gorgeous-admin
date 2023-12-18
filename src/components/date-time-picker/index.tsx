import React from 'react'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'

const DateTimePicker: React.FC = (props) => {
  const { value, onChange } = props as any

  return (
    <DatePicker {...props} showTime format="YYYY-MM-DD HH:mm:ss" value={dayjs(value)} onChange={(v, f) => { onChange(f) }} />
  )
}

export default React.memo(DateTimePicker)

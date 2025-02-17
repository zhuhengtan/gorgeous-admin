import APIFunction from '@/service'
import { useRequest } from 'ahooks'
import { Select } from 'antd'
import React from 'react'

interface Props {
  readOnly?: boolean;
  entityName: string;
  fieldMap?: JsonObject;
  multiple?: boolean;
  value?: string | number | (string | number)[];
  onChange?: (v: string | number | (string | number)[]) => void;
}

const EntitySelect: React.FC<Props> = (props: Props) => {
  const {
    entityName,
    multiple,
    value,
    onChange,
    readOnly,
    fieldMap = { value: 'id', label: 'name' },
    ...otherProps
  } = props

  const { data } = useRequest<JsonObject[], any[]>(() => APIFunction.getEntityOptionList({ entityName }))

  if (readOnly) {
    return (
      <span>{data?.find((item) => item.value === value)?.label as string}</span>
    )
  }

  return (
    <Select
      {...otherProps}
      style={{ width: '100%' }}
      value={value}
      mode={multiple ? 'multiple' : undefined}
      options={data}
      fieldNames={fieldMap}
      onChange={onChange}
    />
  )
}

export default React.memo(EntitySelect)

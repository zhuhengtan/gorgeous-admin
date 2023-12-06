import { Image, Upload, message } from 'antd'
import React, { useState } from 'react'
import { getCookie } from '@/utils/cookie'
import { t } from 'i18next'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

interface Props {
  readOnly?: boolean;
  value: string;
  onChange: (v: string) => void;
}

const ImageUpload: React.FC<Props> = (props) => {
  const { readOnly, value, onChange } = props

  const [loading, setLoading] = useState<boolean>(false)

  if (readOnly) {
    return <Image src={value} />
  }
  return (
    <Upload
      withCredentials
      listType="picture-card"
      showUploadList={false}
      action="/api/b/common/upload"
      headers={{
        authorization: `bearer ${getCookie('token')}`,
      }}
      onChange={(info: any) => {
        if (info.file.status === 'uploading') {
          setLoading(true)
          return
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} ${t('Upload success')}`)
          onChange(info.file.response.data.url)
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} ${t('Upload fail')}`)
        }
        setLoading(false)
      }}
    >
      {value ? (
        <img
          src={value}
          alt="avatar"
          style={{ width: '100%', cursor: 'pointer' }}
        />
      ) : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )}
    </Upload>
  )
}

ImageUpload.defaultProps = {
  readOnly: false,
}

export default React.memo(ImageUpload)

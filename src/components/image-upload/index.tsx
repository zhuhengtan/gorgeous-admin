import { Flex, Image, Upload, message } from "antd"
import React, { useState } from "react"
import { getCookie } from "@/utils/cookie"
import { t } from "i18next"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"

interface Props {
  readOnly?: boolean;
  value?: string;
  onChange?: (v: string) => void;
  children?: React.ReactNode;
}

const ImageUpload: React.FC<Props> = (props) => {
  const { readOnly=false, value, onChange, children } = props

  const [loading, setLoading] = useState<boolean>(false)

  if (readOnly) {
    if (!value) {
      return <span>-</span>
    }
    return <Image style={{ width: 80, height: 80 }} src={value} />
  }
  return (
    <Upload
      accept=".jpg,.png"
      withCredentials
      listType={children?'picture':'picture-card'}
      showUploadList={false}
      action="/api/b/common/upload"
      headers={{
        authorization: `bearer ${getCookie("token")}`,
      }}
      onChange={(info: any) => {
        if (info.file.status === "uploading") {
          setLoading(true)
          return
        }
        if (info.file.status === "done") {
          message.success(`${info.file.name} ${t("Upload success")}`)
          onChange?.(info.file.response.data.url)
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} ${t("Upload fail")}`)
        }
        setLoading(false)
      }}
    >
      <Flex
        align="center"
        justify="center"
        style={{ width: "inherit", height: "inherit", overflow: "hidden" }}
      >
        {value ? (
          <img
            src={value}
            alt="avatar"
            style={{ width: "100%", cursor: "pointer" }}
          />
        ) : children ? (
          children
        ) : (
          <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Flex>
    </Upload>
  )
}

export default React.memo(ImageUpload)

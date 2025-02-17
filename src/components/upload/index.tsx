import { Button, Flex, Image, Upload, message } from "antd"
import React, { useState } from "react"
import { getCookie } from "@/utils/cookie"
import { t } from "i18next"
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { isImage, isVideo } from "@/utils/check"

interface Props {
  readOnly?: boolean;
  value: string;
  onChange: (v: string) => void;
}

const FilePreview = ({ url }: { url: string }) => {
  if (isImage(url)) {
    return <Image style={{ width: 80, height: 80 }} src={url} />
  }
  if (isVideo(url)) {
    return (
      <video
        style={{ width: 80, height: 80 }}
        autoPlay={false}
        onClick={() => {
          window.open(url)
        }}
      ></video>
    )
  }
  return (
    <Button
      type="primary"
      size="small"
      onClick={() => {
        window.open(url)
      }}
    >
      点击查看
    </Button>
  )
}

const CustomUpload: React.FC<Props> = (props) => {
  const { readOnly = false, value, onChange } = props

  console.log(value)

  const [loading, setLoading] = useState<boolean>(false)

  if (readOnly) {
    return <FilePreview url={value} />
  }
  return (
    <Upload
      withCredentials
      listType="picture-card"
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
          onChange(info.file.response.data.url)
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
          <FilePreview url={value} />
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

export default React.memo(CustomUpload)

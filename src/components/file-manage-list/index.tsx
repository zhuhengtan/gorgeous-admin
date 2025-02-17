import { DeleteFilled, EditOutlined, EyeOutlined } from "@ant-design/icons"
import { Button, Flex, Modal } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { v4 } from "uuid"
import CustomUpload from "../upload"
import type { DragEndEvent } from "@dnd-kit/core"
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface FileManageListProps {
  onChange: (value: string[]) => void;
  readOnly?: boolean;
  value: string[];
}

const DraggableDiv = ({
  id,
  style,
  children,
}: {
  id: string;
  style: React.CSSProperties;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  })

  const innerStyle: React.CSSProperties = {
    ...style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "move",
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  }

  return (
    <div ref={setNodeRef} style={innerStyle} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

const FileManageList: React.FC<FileManageListProps> = (
  props: FileManageListProps
) => {
  const { onChange, readOnly, value } = props

  console.log(value)

  const [editOpen, setEditOpen] = useState(false)
  const [innerValue, setInnerValue] = useState<{ url: string; id: string }[]>(
    []
  )

  useEffect(() => {
    if (editOpen) {
      setInnerValue(value?.map((i) => ({ url: i, id: v4() })) || [])
    }
  }, [editOpen, value])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  )

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (active.id !== over?.id) {
        const tmp = JSON.parse(JSON.stringify(innerValue))
        const activeIndex = tmp.findIndex((i: { url: string; id: string }) => i.id === active.id)
        const overIndex = tmp.findIndex((i: { url: string; id: string }) => i.id === over?.id)
        setInnerValue(arrayMove(tmp, activeIndex, overIndex))
      }
    },
    [innerValue]
  )

  return (
    <>
      <Button
        type="link"
        icon={readOnly ? <EyeOutlined /> : <EditOutlined />}
        onClick={() => {
          if (readOnly) {
          } else {
            setEditOpen(true)
          }
        }}
      ></Button>
      <Modal
        title="编辑图集"
        width="60%"
        open={editOpen}
        footer={readOnly ? null : undefined}
        onCancel={() => setEditOpen(false)}
        onOk={() => {
          onChange(innerValue.map((i) => i.url))
          setEditOpen(false)
        }}
      >
        <DndContext
          sensors={sensors}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            // rowKey array
            items={innerValue?.map((i) => i.id)}
            strategy={rectSortingStrategy}
            disabled={readOnly}
          >
            <Flex wrap="wrap">
              {innerValue.map((i) => (
                <DraggableDiv
                  id={i.id}
                  key={i.id}
                  style={{
                    marginRight: 10,
                    marginBottom: 10,
                    position: 'relative',
                  }}
                >
                  <CustomUpload
                    readOnly={readOnly}
                    value={i.url}
                    onChange={(e) => {
                      const tmp = JSON.parse(JSON.stringify(innerValue))
                      tmp.find((item: { url: string; id: string }) => item.id === i.id).url = e
                      setInnerValue(tmp)
                    }}
                  />
                  <Button
                    type="text"
                    size="small"
                    style={{
                      position: 'absolute',
                      right: 2,
                      top: 2,
                      zIndex: 999,
                    }}
                    danger
                    icon={<DeleteFilled/>}
                    onClick={()=>{
                      setInnerValue(innerValue.filter((item)=>item.id !== i.id))
                    }}
                  >
                  </Button>
                </DraggableDiv>
              ))}
              {!readOnly && (
                <CustomUpload
                  key="12138"
                  readOnly={readOnly}
                  value={""}
                  onChange={(e) => {
                    const tmp = JSON.parse(JSON.stringify(innerValue))
                    tmp.push({
                      id: v4(),
                      url: e,
                    })
                    setInnerValue(tmp)
                  }}
                />
              )}
            </Flex>
          </SortableContext>
        </DndContext>
      </Modal>
    </>
  )
}

export default React.memo(FileManageList)

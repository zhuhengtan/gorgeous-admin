import React from 'react'
import styles from './index.module.less'

export default function NotFound() {
  return (
    <div className={styles['not-found-container']}>
      <div>404</div>
      <div>Page NotFound</div>
    </div>
  )
}

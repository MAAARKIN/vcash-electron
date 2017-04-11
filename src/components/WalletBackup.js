import React from 'react'
import { translate } from 'react-i18next'
import { action, computed, observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import { Button, Col, Input, Row, message } from 'antd'
import { remote } from 'electron'
import { sep } from 'path'
import { dataPath } from '../utilities/common'

/** Load translation namespaces and delay rendering until they are loaded. */
@translate(['wallet'], { wait: true })

/** Make the component reactive. */
@inject('rpc') @observer

export default class WalletBackup extends React.Component {
  @observable path
  @observable error = false

  constructor (props) {
    super(props)
    this.t = props.t
    this.rpc = props.rpc
    this.path = this.rpc.connection.status.tunnel === true ? '' : dataPath()
  }

  /**
   * Get error status.
   * @function errorStatus
   * @return {string|false} Current error or false if none.
   */
  @computed get errorStatus () {
    if (this.error !== false) return this.error
    return false
  }

  /**
   * Set RPC error.
   * @function setError
   * @param {string} error - RPC error.
   */
  @action setError = (error = false) => {
    this.error = error
  }

  /**
   * Set backup path.
   * @function setPath
   */
  @action setPath = () => {
    /** Open directory browser. */
    const selected = remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    /** Set selected path. */
    if (typeof selected !== 'undefined') {
      this.path = selected[0] + sep
    }
  }

  /**
   * Backup the wallet.
   * @function backup
   */
  backup = () => {
    this.rpc.execute([
      { method: 'backupwallet', params: [this.path] }
    ], (response) => {
      /** Handle result. */
      if (response[0].hasOwnProperty('result') === true) {
        /** Display a success message. */
        message.success(this.t('wallet:backedUp'), 6)
      }

      /** Handle error. */
      if (response[0].hasOwnProperty('error') === true) {
        /** Convert error code to string. */
        switch (response[0].error.code) {
          /** -4 = error_code_wallet_error */
          case -4:
            this.setError('backupFailed')
            break
        }
      }
    })
  }

  render () {
    return (
      <div>
        <p style={{margin: '0 0 5px 0'}}>
          <i className='material-icons md-18'>save</i>
          <span
            style={{
              margin: '0 0 0 7px',
              verticalAlign: 'top'
            }}
          >
            {this.t('wallet:backupLong')}
          </span>
        </p>
        <Row>
          <Col span={3}>
            <p style={{margin: '4px 0 0 0'}}>
              {this.t('wallet:saveInto')}
            </p>
          </Col>
          <Col span={21}>
            <Input
              disabled
              value={
                this.rpc.connection.status.tunnel === true
                  ? this.t('wallet:remoteDataFolder')
                  : this.path
              }
            />
          </Col>
        </Row>
        <Row>
          <Col span={12} offset={3}>
            <p className='red' style={{margin: '3px 0 3px 1px'}}>
              {
                this.errorStatus === 'backupFailed' &&
                this.t('wallet:backupFailed')
              }
            </p>
          </Col>
          <Col span={9} style={{textAlign: 'right'}}>
            <Button
              disabled={this.rpc.connection.status.tunnel === true}
              style={{margin: '5px 0 0 0'}}
              onClick={this.setPath}
            >
              {this.t('wallet:browse')}
            </Button>
            <Button
              style={{margin: '5px 0 0 5px'}}
              onClick={this.backup}
            >
              {this.t('wallet:backup')}
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

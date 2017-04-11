import React from 'react'
import { translate } from 'react-i18next'
import { inject, observer } from 'mobx-react'
import { Col, Input, Popconfirm, Row } from 'antd'

/** Load translation namespaces and delay rendering until they are loaded. */
@translate(['wallet'], { wait: true })

/** Make the component reactive and inject MobX stores. */
@inject('gui', 'rates', 'send') @observer

export default class SendRecipient extends React.Component {
  constructor (props) {
    super(props)
    this.t = props.t
    this.data = props.data
    this.gui = props.gui
    this.rates = props.rates
    this.send = props.send
  }

  /**
   * Remove recipient.
   * @function removeRecipient
   * @param {string} uid - Uid.
   */
  removeRecipient = (uid) => {
    this.send.removeRecipient(uid)
  }

  /**
   * Set recipient.
   * @function setRecipient
   * @param {object} e - Input element event.
   */
  setRecipient = (e) => {
    this.send.setRecipient(e.target.id, e.target.name, e.target.value)
  }

  render () {
    const { local, average } = this.rates
    const { uid, address, addressValid, amount } = this.data

    return (
      <div style={{margin: '0 0 5px 0'}}>
        <Row key={uid}>
          <Col span={13}>
            <div style={{margin: '0 5px 0 0'}}>
              <Input
                value={address}
                name='address'
                id={uid}
                placeholder={this.t('wallet:address')}
                onChange={this.setRecipient}
                className={'text-mono ' +
                  (addressValid !== null
                    ? addressValid === true
                        ? 'green'
                        : 'red'
                    : '')
                }
                addonBefore={
                  <Popconfirm
                    placement='bottomLeft'
                    title={this.t('wallet:recipientRemove')}
                    okText={this.t('wallet:yes')}
                    cancelText={this.t('wallet:no')}
                    onConfirm={() => this.removeRecipient(uid)}
                  >
                    <i className='material-icons md-16'>delete_forever</i>
                  </Popconfirm>
                }
              />
            </div>
          </Col>
          <Col span={6}>
            <div style={{margin: '0 5px 0 0'}}>
              <Input
                value={amount}
                name='amount'
                id={uid}
                placeholder={this.t('wallet:amount')}
                addonAfter='XVC'
                onChange={this.setRecipient}
              />
            </div>
          </Col>
          <Col span={5}>
            <Input
              disabled
              value={
                new Intl.NumberFormat(this.gui.language, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(amount * average * local)
              }
              addonAfter={this.gui.localCurrency}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

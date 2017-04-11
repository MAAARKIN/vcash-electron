import React from 'react'
import { translate } from 'react-i18next'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Menu } from 'antd'

/** Required components. */
import WalletLock from './WalletLock'
import WalletUnlock from './WalletUnlock'

/** Load translation namespaces and delay rendering until they are loaded. */
@translate(['wallet'], { wait: true })

/** Make the component reactive and inject MobX stores. */
@inject('connections', 'gui', 'info', 'rates', 'wallet') @observer

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.t = props.t
    this.connections = props.connections
    this.gui = props.gui
    this.info = props.info
    this.rates = props.rates
    this.wallet = props.wallet
  }

  render () {
    const { local, average } = this.rates
    const { balance, newmint, stake } = this.info.wallet
    const { Item } = Menu

    return (
      <header className='shadow'>
        <div style={{float: 'left'}}>
          <img src='./assets/images/logoRed.png' />
          <p>
            {this.t('wallet:balance')}
            <br />
            <span>
              {
                new Intl.NumberFormat(this.gui.language, {
                  minimumFractionDigits: 6,
                  maximumFractionDigits: 6
                }).format(balance)
              }
            </span> XVC
          </p>
          <p className='balance'>
            ~<span>
              {
                new Intl.NumberFormat(this.gui.language, {
                  minimumFractionDigits: 8,
                  maximumFractionDigits: 8
                }).format(balance * average)
              }
            </span> BTC
          </p>
          <p className='balance'>
            ~<span>
              {
                new Intl.NumberFormat(this.gui.language, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(balance * average * local)
              }
            </span> {this.gui.localCurrency}
          </p>
          <div className='incoming'>
            {
              this.wallet.pendingAmount > 0 && (
                <p>
                  {this.t('wallet:pending')}
                  <br />
                  <span>
                    {
                      new Intl.NumberFormat(this.gui.language, {
                        minimumFractionDigits: 6,
                        maximumFractionDigits: 6
                      }).format(this.wallet.pendingAmount)
                    }
                  </span> XVC
                </p>
              )
            }
            {
              newmint > 0 && (
                <p>
                  {this.t('wallet:immature')}
                  <br />
                  <span>
                    {
                      new Intl.NumberFormat(this.gui.language, {
                        minimumFractionDigits: 6,
                        maximumFractionDigits: 6
                      }).format(newmint)
                    }
                  </span> XVC
                </p>
              )
            }
            {
              stake > 0 && (
                <p>
                  {this.t('wallet:staking')}
                  <br />
                  <span>
                    {
                      new Intl.NumberFormat(this.gui.language, {
                        minimumFractionDigits: 6,
                        maximumFractionDigits: 6
                      }).format(stake)
                    }
                  </span> XVC
                </p>
              )
            }
          </div>
        </div>
        <div style={{float: 'right', margin: '0 10px 0 0'}}>
          <WalletLock />
          <WalletUnlock />
        </div>
        <nav>
          <Menu
            mode='horizontal'
            defaultSelectedKeys={['/']}
            onClick={
              (item) => {
                this.props.history.push(
                  '/' +
                  this.connections.viewing +
                  item.key
                )
              }
            }
          >
            <Item key='/'>
              <i className='material-icons md-20'>account_balance_wallet</i>
            </Item>
            <Item key='/addresses'>
              <i className='material-icons md-20'>send</i>
            </Item>
            <Item key='/network'>
              <i className='material-icons md-20'>public</i>
            </Item>
            <Item key='/maintenance'>
              <i className='material-icons md-20'>settings</i>
            </Item>
          </Menu>
        </nav>
      </header>
    )
  }
}

export default withRouter(Header)

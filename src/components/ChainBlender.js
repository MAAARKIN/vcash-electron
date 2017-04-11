import React from 'react'
import { translate } from 'react-i18next'
import { inject, observer } from 'mobx-react'
import { Switch, Tooltip, message } from 'antd'

/** Load translation namespaces and delay rendering until they are loaded. */
@translate(['wallet'], { wait: true })

/** Make the component reactive and inject MobX stores. */
@inject('gui', 'info', 'rpc') @observer

export default class ChainBlender extends React.Component {
  constructor (props) {
    super(props)
    this.t = props.t
    this.gui = props.gui
    this.info = props.info
    this.rpc = props.rpc
  }

  /**
   * Toggle ChainBlender.
   * @function toggle
   */
  toggle = () => {
    this.rpc.execute([
      {
        method: 'chainblender',
        params: [this.info.isBlending === true ? 'stop' : 'start']
      }
    ], (response) => {
      /** Handle result. */
      if (response[0].hasOwnProperty('result') === true) {
        /** Update blending status. */
        this.info.setBlendingStatus()

        /** Display a success message. */
        message.success(
          this.t('wallet:chainBlender',
            {
              context: this.info.isBlending === true ? 'start' : 'stop'
            }
          ), 6
        )
      }
    })
  }

  render () {
    return (
      <div>
        <Tooltip
          title={this.t('wallet:toggleChainBlender')}
          placement='bottomLeft'
        >
          <Switch
            size='small'
            checked={this.info.isBlending === true}
            disabled={this.info.isLocked === true}
            onChange={this.toggle}
            checkedChildren={
              <i
                className='material-icons md-16'
                style={{margin: '-2px 0 0 0'}}
              >
                done
              </i>
            }
            unCheckedChildren={
              <i
                className='material-icons md-16'
                style={{margin: '-2px 0 0 0'}}
              >
                clear
              </i>
            }
          />
        </Tooltip>
        <p
          style={{
            margin: '0 0 0 11px',
            verticalAlign: '-1px'
          }}
        >
          {this.t('wallet:blended')}
          <span> {
              new Intl.NumberFormat(this.gui.language, {
                minimumFractionDigits: 6,
                maximumFractionDigits: 6
              }).format(this.info.chainBlender.blendedbalance)
            }
          </span> XVC (
          <span>
            {
              new Intl.NumberFormat(this.gui.language, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(this.info.chainBlender.blendedpercentage)
            }
          </span>%)
        </p>
        {
          this.info.isLocked === false && (
            <p
              style={{
                margin: '0 0 0 11px',
                verticalAlign: '-1px'
              }}
            >
              {this.t('wallet:denominated')}
              <span> {
                  new Intl.NumberFormat(this.gui.language, {
                    minimumFractionDigits: 6,
                    maximumFractionDigits: 6
                  }).format(this.info.chainBlender.denominatedbalance)
                }
              </span> XVC
            </p>
          )
        }
      </div>
    )
  }
}

import React from 'react'
import classnames from 'classnames'
import SVG from 'react-inlinesvg'
import {Popover} from 'antd'
import {EmptyProps} from 'antd/lib/empty'
import {SynchronizationStatus, LoadedState} from './wallet-state'
import {useInterval} from './hook-utils'
import {withStatusGuard, PropsWithWalletState} from './wallet-status-guard'
import {Trans} from './Trans'
import refreshIcon from '../assets/icons/refresh.svg'
import './SyncStatus.scss'

interface SyncStatusProps {
  syncStatus: SynchronizationStatus
}

type SyncStatus = 'offline' | 'synced' | 'syncing'

const getSyncStatus = (syncStatus: SynchronizationStatus): SyncStatus => {
  if (syncStatus.mode === 'offline') return 'offline'
  if (syncStatus.percentage === 100) return 'synced'
  return 'syncing'
}

export const SyncMessage = ({syncStatus}: SyncStatusProps): JSX.Element => {
  if (syncStatus.mode === 'offline') return <Trans k={['wallet', 'syncStatus', 'syncConnecting']} />
  if (syncStatus.percentage === 100) return <Trans k={['wallet', 'syncStatus', 'fullySynced']} />
  return (
    <Trans k={['wallet', 'syncStatus', 'syncing']} values={{percentage: syncStatus.percentage}} />
  )
}

export const SyncStatusContent = ({syncStatus}: SyncStatusProps): JSX.Element => {
  const classes = classnames('SyncStatus', getSyncStatus(syncStatus))
  const popoverContent = (
    <span>
      <div>
        <Trans
          k={['wallet', 'syncStatus', 'currentBlock']}
          values={{blockNumber: syncStatus.currentBlock}}
        />
      </div>
      {syncStatus.mode === 'online' && (
        <div>
          <Trans
            k={['wallet', 'syncStatus', 'highestBlock']}
            values={{blockNumber: syncStatus.highestKnownBlock}}
          />
        </div>
      )}
    </span>
  )
  return (
    <span className={classes}>
      <Popover content={popoverContent} placement="left">
        <span>
          <SyncMessage syncStatus={syncStatus} />
          <SVG src={refreshIcon} className="svg" />
        </span>
      </Popover>
    </span>
  )
}

const _SyncStatus = ({walletState}: PropsWithWalletState<EmptyProps, LoadedState>): JSX.Element => {
  useInterval(() => {
    walletState.refreshSyncStatus()
  }, 3000)

  return <SyncStatusContent syncStatus={walletState.syncStatus} />
}

export const SyncStatus = withStatusGuard(_SyncStatus, 'LOADED', () => <></>)

// @flow

import React, { Component } from 'react'
import Button from '../../Button'
import Input from '../../Input'
import Section from '../Section'

import styles from './management.module.css'

type Props = {
    onAddUsersClick: (Array<string>) => void,
    onMintClick: () => void,
    onStealClick: () => void,
}

type State = {
    addresses: string,
}

class Management extends Component<Props, State> {
    state = {
        addresses: '',
    }

    onAddressesChange = ({ target: { value: addresses } }: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            addresses,
        })
    }

    onAddUsersClick = () => {
        const { onAddUsersClick } = this.props
        const { addresses } = this.state

        onAddUsersClick(addresses.split(/[\r\n]/m).filter(Boolean))
        this.setState({
            addresses: '',
        })
    }

    render() {
        const { addresses } = this.state
        const { onMintClick, onStealClick } = this.props

        return (
            <Section title="Management">
                <div className={styles.root}>
                    <div className={styles.users}>
                        <textarea
                            placeholder="Enter Ethereum addresses, one per line…"
                            className={Input.styles.textArea}
                            value={addresses}
                            onChange={this.onAddressesChange}
                        />
                        <div className={styles.buttons}>
                            <Button
                                className={styles.addUsers}
                                onClick={this.onAddUsersClick}
                                tooltip="Add the addresses to the revenue sharing pool.
                                These users will then receive revenue shares from tokens that are
                                transferred to the Monoplasma contract."
                            >
                                Add users
                            </Button>
                        </div>
                    </div>
                    <div className={styles.tokens}>
                        <Button
                            className={styles.button}
                            theme="edge"
                            onClick={onMintClick}
                            tooltip="Mints new tokens to the currently selected account in Metamask."
                        >
                            Mint tokens
                        </Button>
                        <Button
                            className={styles.button}
                            theme="red-edge"
                            onClick={onStealClick}
                            tooltip="Operator can try to publish a block where all tokens
                            have been allocated to it. Validators should notice."
                        >
                            Steal all tokens
                        </Button>
                    </div>
                </div>
            </Section>
        )
    }
}

export default Management

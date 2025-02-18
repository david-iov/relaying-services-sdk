import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { RelayingServicesAddresses } from './interfaces';
import { getContract, getContractAddresses, mergeConfiguration } from './utils';
import {
    DeployVerifier,
    RelayVerifier,
    SmartWalletFactory
} from '@rsksmart/rif-relay-contracts';
import { ContractError } from './ContractError';

export class Contracts {
    private web3Instance: Web3;
    public addresses: RelayingServicesAddresses;
    private smartWalletFactory: Contract;
    private smartWalletRelayVerifier: Contract;
    private smartWalletDeployVerifier: Contract;

    constructor(
        web3Instance: Web3,
        chainId: number,
        contractAddresses?: RelayingServicesAddresses
    ) {
        this.web3Instance = web3Instance;
        contractAddresses = contractAddresses ?? <RelayingServicesAddresses>{};
        let contracts: RelayingServicesAddresses = <
            RelayingServicesAddresses
        >{};
        try {
            contracts = getContractAddresses(chainId);
        } catch (error: any) {
            if (error instanceof ContractError) {
                console.warn(error);
            } else {
                throw error;
            }
        }
        this.addresses = <RelayingServicesAddresses>(
            mergeConfiguration(contractAddresses, contracts)
        );
        this.initialize();
    }

    protected initialize(): void {
        try {
            this.smartWalletRelayVerifier = getContract(
                this.web3Instance,
                RelayVerifier.abi,
                this.addresses.smartWalletRelayVerifier
            );
            this.smartWalletDeployVerifier = getContract(
                this.web3Instance,
                DeployVerifier.abi,
                this.addresses.smartWalletDeployVerifier
            );
            console.debug('Contracts initialized correctly');
        } catch (error: any) {
            throw new Error('Contracts fail to initialize: ' + error.message);
        }
    }

    public getSmartWalletFactory(): Contract {
        if (!this.smartWalletFactory) {
            this.smartWalletFactory = getContract(
                this.web3Instance,
                SmartWalletFactory.abi,
                this.addresses.smartWalletFactory
            );
        }
        return this.smartWalletFactory;
    }

    public getSmartWalletRelayVerifier(): Contract {
        if (!this.smartWalletRelayVerifier) {
            this.smartWalletRelayVerifier = getContract(
                this.web3Instance,
                RelayVerifier.abi,
                this.addresses.smartWalletRelayVerifier
            );
        }
        return this.smartWalletRelayVerifier;
    }

    public getSmartWalletDeployVerifier(): Contract {
        if (!this.smartWalletDeployVerifier) {
            this.smartWalletDeployVerifier = getContract(
                this.web3Instance,
                DeployVerifier.abi,
                this.addresses.smartWalletDeployVerifier
            );
        }
        return this.smartWalletDeployVerifier;
    }
}

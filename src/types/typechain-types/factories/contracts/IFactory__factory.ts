/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type { IFactory, IFactoryInterface } from "../../contracts/IFactory";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [],
    name: "BotNotFound",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "ERC1967InvalidImplementation",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967NonPayable",
    type: "error",
  },
  {
    inputs: [],
    name: "EnforcedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "ExpectedPause",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedCall",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidFee",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidImplementation",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [],
    name: "UUPSUnauthorizedCallContext",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "slot",
        type: "bytes32",
      },
    ],
    name: "UUPSUnsupportedProxiableUUID",
    type: "error",
  },
  {
    inputs: [],
    name: "UnauthorizedAccess",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "botAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "BotCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newFee",
        type: "uint256",
      },
    ],
    name: "BotCreationFeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "botAddress",
        type: "address",
      },
    ],
    name: "BotPaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "botAddress",
        type: "address",
      },
    ],
    name: "BotUnpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldImpl",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newImpl",
        type: "address",
      },
    ],
    name: "ImplementationUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
    ],
    name: "initPriceUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "UPGRADE_INTERFACE_VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "botCreationFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "bots",
    outputs: [
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_creator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_instructionLengthFee",
        type: "uint256",
      },
    ],
    name: "createBot",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "botAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "disburse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_implementation",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_botCreationFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_initPrice",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalBots",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newFee",
        type: "uint256",
      },
    ],
    name: "updateBotCreationFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "updateImplementation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
    ],
    name: "updateInitPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60a06040523060805234801561001457600080fd5b5061001d610022565b6100d4565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000900460ff16156100725760405163f92ee8a960e01b815260040160405180910390fd5b80546001600160401b03908116146100d15780546001600160401b0319166001600160401b0390811782556040519081527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50565b6080516118746100fd60003960008181610beb01528181610c140152610d5501526118746000f3fe60806040526004361061012d5760003560e01c80635c60da1b116100ab5780638da5cb5b1161006f5780638da5cb5b146102f1578063aaa11cc91461032e578063ad3cb1cc1461034e578063b6add0f41461038c578063bfd79284146103a2578063f2fde38b1461041257600080fd5b80635c60da1b146102575780635c975abb14610277578063715018a6146102a75780637a1ac61e146102bc5780638456cb59146102dc57600080fd5b806349d87862116100f257806349d87862146101d95780634a3d4c07146101f95780634f1ef2861461021957806352d1902d1461022c57806356b4bb6e1461024157600080fd5b8062c153a614610139578063025b22bc146101695780633ccfd60b1461018b5780633f4ba83a146101ae578063471df079146101c357600080fd5b3661013457005b600080fd5b61014c610147366004611131565b610432565b6040516001600160a01b0390911681526020015b60405180910390f35b34801561017557600080fd5b5061018961018436600461115b565b61062d565b005b34801561019757600080fd5b506101a06106ac565b604051908152602001610160565b3480156101ba57600080fd5b506101896106c6565b3480156101cf57600080fd5b506101a060015481565b3480156101e557600080fd5b506101896101f4366004611176565b6106d8565b34801561020557600080fd5b50610189610214366004611176565b610726565b6101896102273660046111a5565b61076c565b34801561023857600080fd5b506101a061078b565b34801561024d57600080fd5b506101a060035481565b34801561026357600080fd5b5060005461014c906001600160a01b031681565b34801561028357600080fd5b5060008051602061181f8339815191525460ff166040519015158152602001610160565b3480156102b357600080fd5b506101896107a8565b3480156102c857600080fd5b506101896102d736600461126f565b6107ba565b3480156102e857600080fd5b50610189610930565b3480156102fd57600080fd5b507f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031661014c565b34801561033a57600080fd5b506101896103493660046112a2565b610940565b34801561035a57600080fd5b5061037f604051806040016040528060058152602001640352e302e360dc1b81525081565b6040516101609190611325565b34801561039857600080fd5b506101a060025481565b3480156103ae57600080fd5b506103eb6103bd36600461115b565b6004602052600090815260409020805460018201546002909201546001600160a01b03909116919060ff1683565b604080516001600160a01b0390941684526020840192909252151590820152606001610160565b34801561041e57600080fd5b5061018961042d36600461115b565b6109a7565b600061043c6109ea565b610444610a34565b600060015483610454919061134e565b905080341015610477576040516358d620b360e01b815260040160405180910390fd5b600254604080513060248201526001600160a01b03878116604483015260648083019490945282518083039094018452608490910182526020830180516001600160e01b03166305e52ecf60e21b17905260008054925190929091169083906104df90611108565b6104ea929190611361565b604051809103906000f080158015610506573d6000803e3d6000fd5b50604080516060810182526001600160a01b038981168252426020808401918252600184860181815287851660009081526004909352958220855181546001600160a01b031916951694909417845591519183019190915592516002909101805460ff1916911515919091179055600380549394509092916105878361138d565b909155506000905061059985346113a6565b905080156105ab576105ab8382610a65565b876001600160a01b0316836001600160a01b03167e63f9fe420d14294f0ca96153297a0fba0b5e3d6e4e59e6dd73c62324099b26426040516105ef91815260200190565b60405180910390a35090935050505061062760017f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f0055565b92915050565b610635610b25565b6001600160a01b03811661065c5760405163340aafcd60e11b815260040160405180910390fd5b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917faa3f731066a578e5f39b4215468d826cdd15373cbc0dfc9cb9bdc649718ef7da9190a35050565b60006106b6610b25565b476106c13382610a65565b905090565b6106ce610b25565b6106d6610b80565b565b6106e0610b25565b600180549082905560408051828152602081018490527ff319e9b669b28c1ae3f141ff37979ae450cc3db3d12bbe0b0a6709604b556b3b91015b60405180910390a15050565b61072e610b25565b600280549082905560408051828152602081018490527f73c3f075675fa83780b28f396223fecfbe47b099e6b4dc3b8fe8ce8b5872499f910161071a565b610774610be0565b61077d82610c85565b6107878282610c8d565b5050565b6000610795610d4a565b506000805160206117ff83398151915290565b6107b0610b25565b6106d66000610d93565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff16159067ffffffffffffffff166000811580156108005750825b905060008267ffffffffffffffff16600114801561081d5750303b155b90508115801561082b575080155b156108495760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561087357845460ff60401b1916600160401b1785555b6001600160a01b03881661089a5760405163340aafcd60e11b815260040160405180910390fd5b6108a333610e04565b6108ab610e15565b6108b3610e1d565b6108bb610e2d565b600080546001600160a01b0319166001600160a01b038a1617905560018790556002869055831561092657845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b5050505050505050565b610938610b25565b6106d6610e3d565b610948610b25565b6040516301c8ce8960e41b81526001600160a01b038281166004830152831690631c8ce89090602401600060405180830381600087803b15801561098b57600080fd5b505af115801561099f573d6000803e3d6000fd5b505050505050565b6109af610b25565b6001600160a01b0381166109de57604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b6109e781610d93565b50565b7f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00805460011901610a2e57604051633ee5aeb560e01b815260040160405180910390fd5b60029055565b60008051602061181f8339815191525460ff16156106d65760405163d93c066560e01b815260040160405180910390fd5b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114610ab2576040519150601f19603f3d011682016040523d82523d6000602084013e610ab7565b606091505b5050905080610afa5760405162461bcd60e51b815260206004820152600f60248201526e151c985b9cd9995c8819985a5b1959608a1b60448201526064016109d5565b505050565b60017f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f0055565b33610b577f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b0316146106d65760405163118cdaa760e01b81523360048201526024016109d5565b610b88610e86565b60008051602061181f833981519152805460ff191681557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a150565b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480610c6757507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610c5b6000805160206117ff833981519152546001600160a01b031690565b6001600160a01b031614155b156106d65760405163703e46dd60e11b815260040160405180910390fd5b6109e7610b25565b816001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015610ce7575060408051601f3d908101601f19168201909252610ce4918101906113b9565b60015b610d0f57604051634c9c8ce360e01b81526001600160a01b03831660048201526024016109d5565b6000805160206117ff8339815191528114610d4057604051632a87526960e21b8152600481018290526024016109d5565b610afa8383610eb6565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146106d65760405163703e46dd60e11b815260040160405180910390fd5b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b610e0c610f0c565b6109e781610f55565b6106d6610f0c565b610e25610f0c565b6106d6610f5d565b610e35610f0c565b6106d6610f7e565b610e45610a34565b60008051602061181f833981519152805460ff191660011781557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25833610bc2565b60008051602061181f8339815191525460ff166106d657604051638dfc202b60e01b815260040160405180910390fd5b610ebf82610f86565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a2805115610f0457610afa8282610feb565b610787611061565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0054600160401b900460ff166106d657604051631afcd79f60e31b815260040160405180910390fd5b6109af610f0c565b610f65610f0c565b60008051602061181f833981519152805460ff19169055565b610aff610f0c565b806001600160a01b03163b600003610fbc57604051634c9c8ce360e01b81526001600160a01b03821660048201526024016109d5565b6000805160206117ff83398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b6060600080846001600160a01b03168460405161100891906113d2565b600060405180830381855af49150503d8060008114611043576040519150601f19603f3d011682016040523d82523d6000602084013e611048565b606091505b5091509150611058858383611080565b95945050505050565b34156106d65760405163b398979f60e01b815260040160405180910390fd5b60608261109557611090826110df565b6110d8565b81511580156110ac57506001600160a01b0384163b155b156110d557604051639996b31560e01b81526001600160a01b03851660048201526024016109d5565b50805b9392505050565b8051156110ef5780518082602001fd5b60405163d6bda27560e01b815260040160405180910390fd5b610410806113ef83390190565b80356001600160a01b038116811461112c57600080fd5b919050565b6000806040838503121561114457600080fd5b61114d83611115565b946020939093013593505050565b60006020828403121561116d57600080fd5b6110d882611115565b60006020828403121561118857600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b600080604083850312156111b857600080fd5b6111c183611115565b9150602083013567ffffffffffffffff8111156111dd57600080fd5b8301601f810185136111ee57600080fd5b803567ffffffffffffffff8111156112085761120861118f565b604051601f8201601f19908116603f0116810167ffffffffffffffff811182821017156112375761123761118f565b60405281815282820160200187101561124f57600080fd5b816020840160208301376000602083830101528093505050509250929050565b60008060006060848603121561128457600080fd5b61128d84611115565b95602085013595506040909401359392505050565b600080604083850312156112b557600080fd5b6112be83611115565b91506112cc60208401611115565b90509250929050565b60005b838110156112f05781810151838201526020016112d8565b50506000910152565b600081518084526113118160208601602086016112d5565b601f01601f19169290920160200192915050565b6020815260006110d860208301846112f9565b634e487b7160e01b600052601160045260246000fd5b8082018082111561062757610627611338565b6001600160a01b0383168152604060208201819052600090611385908301846112f9565b949350505050565b60006001820161139f5761139f611338565b5060010190565b8181038181111561062757610627611338565b6000602082840312156113cb57600080fd5b5051919050565b600082516113e48184602087016112d5565b919091019291505056fe608060405260405161041038038061041083398101604081905261002291610268565b61002c8282610033565b5050610358565b61003c82610092565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a280511561008657610081828261010e565b505050565b61008e610185565b5050565b806001600160a01b03163b6000036100cd57604051634c9c8ce360e01b81526001600160a01b03821660048201526024015b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060600080846001600160a01b03168460405161012b919061033c565b600060405180830381855af49150503d8060008114610166576040519150601f19603f3d011682016040523d82523d6000602084013e61016b565b606091505b50909250905061017c8583836101a6565b95945050505050565b34156101a45760405163b398979f60e01b815260040160405180910390fd5b565b6060826101bb576101b682610205565b6101fe565b81511580156101d257506001600160a01b0384163b155b156101fb57604051639996b31560e01b81526001600160a01b03851660048201526024016100c4565b50805b9392505050565b8051156102155780518082602001fd5b60405163d6bda27560e01b815260040160405180910390fd5b634e487b7160e01b600052604160045260246000fd5b60005b8381101561025f578181015183820152602001610247565b50506000910152565b6000806040838503121561027b57600080fd5b82516001600160a01b038116811461029257600080fd5b60208401519092506001600160401b038111156102ae57600080fd5b8301601f810185136102bf57600080fd5b80516001600160401b038111156102d8576102d861022e565b604051601f8201601f19908116603f011681016001600160401b03811182821017156103065761030661022e565b60405281815282820160200187101561031e57600080fd5b61032f826020830160208601610244565b8093505050509250929050565b6000825161034e818460208701610244565b9190910192915050565b60aa806103666000396000f3fe6080604052600a600c565b005b60186014601a565b6051565b565b6000604c7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b905090565b3660008037600080366000845af43d6000803e808015606f573d6000f35b3d6000fdfea2646970667358221220195df7dbaac7c3b7602d2b2a19bc2caec0e4d3c606b6949b0f3637863dbfa10864736f6c634300081b0033360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbccd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300a2646970667358221220c86eedbde4286359cf6e703f05af90ce7154d93f3f5341926407a808219b440864736f6c634300081b0033";

type IFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: IFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class IFactory__factory extends ContractFactory {
  constructor(...args: IFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      IFactory & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): IFactory__factory {
    return super.connect(runner) as IFactory__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): IFactoryInterface {
    return new Interface(_abi) as IFactoryInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): IFactory {
    return new Contract(address, _abi, runner) as unknown as IFactory;
  }
}

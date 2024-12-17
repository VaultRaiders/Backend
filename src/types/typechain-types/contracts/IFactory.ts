/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface IFactoryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "UPGRADE_INTERFACE_VERSION"
      | "botCreationFee"
      | "bots"
      | "createBot"
      | "disbursement"
      | "implementation"
      | "initPrice"
      | "initialize"
      | "owner"
      | "pause"
      | "pauseBot"
      | "paused"
      | "proxiableUUID"
      | "renounceOwnership"
      | "totalBots"
      | "transferOwnership"
      | "unpause"
      | "unpauseBot"
      | "updateBotCreationFee"
      | "updateImplementation"
      | "updateInitPrice"
      | "upgradeToAndCall"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "BotCreated"
      | "BotCreationFeeUpdated"
      | "BotPaused"
      | "BotUnpaused"
      | "ImplementationUpdated"
      | "Initialized"
      | "OwnershipTransferred"
      | "Paused"
      | "Unpaused"
      | "Upgraded"
      | "initPriceUpdated"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "UPGRADE_INTERFACE_VERSION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "botCreationFee",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "bots", values: [AddressLike]): string;
  encodeFunctionData(
    functionFragment: "createBot",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "disbursement",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "implementation",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "initPrice", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [AddressLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pauseBot",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "totalBots", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "unpauseBot",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateBotCreationFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updateImplementation",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateInitPrice",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "UPGRADE_INTERFACE_VERSION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "botCreationFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "bots", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "createBot", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "disbursement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "implementation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initPrice", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pauseBot", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "totalBots", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unpauseBot", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updateBotCreationFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateImplementation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateInitPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace BotCreatedEvent {
  export type InputTuple = [
    botAddress: AddressLike,
    creator: AddressLike,
    timestamp: BigNumberish
  ];
  export type OutputTuple = [
    botAddress: string,
    creator: string,
    timestamp: bigint
  ];
  export interface OutputObject {
    botAddress: string;
    creator: string;
    timestamp: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BotCreationFeeUpdatedEvent {
  export type InputTuple = [oldFee: BigNumberish, newFee: BigNumberish];
  export type OutputTuple = [oldFee: bigint, newFee: bigint];
  export interface OutputObject {
    oldFee: bigint;
    newFee: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BotPausedEvent {
  export type InputTuple = [botAddress: AddressLike];
  export type OutputTuple = [botAddress: string];
  export interface OutputObject {
    botAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BotUnpausedEvent {
  export type InputTuple = [botAddress: AddressLike];
  export type OutputTuple = [botAddress: string];
  export interface OutputObject {
    botAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ImplementationUpdatedEvent {
  export type InputTuple = [oldImpl: AddressLike, newImpl: AddressLike];
  export type OutputTuple = [oldImpl: string, newImpl: string];
  export interface OutputObject {
    oldImpl: string;
    newImpl: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UnpausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpgradedEvent {
  export type InputTuple = [implementation: AddressLike];
  export type OutputTuple = [implementation: string];
  export interface OutputObject {
    implementation: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace initPriceUpdatedEvent {
  export type InputTuple = [oldPrice: BigNumberish, newPrice: BigNumberish];
  export type OutputTuple = [oldPrice: bigint, newPrice: bigint];
  export interface OutputObject {
    oldPrice: bigint;
    newPrice: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IFactory extends BaseContract {
  connect(runner?: ContractRunner | null): IFactory;
  waitForDeployment(): Promise<this>;

  interface: IFactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  UPGRADE_INTERFACE_VERSION: TypedContractMethod<[], [string], "view">;

  botCreationFee: TypedContractMethod<[], [bigint], "view">;

  bots: TypedContractMethod<
    [arg0: AddressLike],
    [
      [string, bigint, boolean] & {
        creator: string;
        createdAt: bigint;
        isActive: boolean;
      }
    ],
    "view"
  >;

  createBot: TypedContractMethod<
    [_creator: AddressLike, _instructionLengthFee: BigNumberish],
    [string],
    "payable"
  >;

  disbursement: TypedContractMethod<
    [botAddress: AddressLike, to: AddressLike],
    [void],
    "nonpayable"
  >;

  implementation: TypedContractMethod<[], [string], "view">;

  initPrice: TypedContractMethod<[], [bigint], "view">;

  initialize: TypedContractMethod<
    [
      _implementation: AddressLike,
      _botCreationFee: BigNumberish,
      _initPrice: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  pause: TypedContractMethod<[], [void], "nonpayable">;

  pauseBot: TypedContractMethod<
    [botAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  paused: TypedContractMethod<[], [boolean], "view">;

  proxiableUUID: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  totalBots: TypedContractMethod<[], [bigint], "view">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  unpause: TypedContractMethod<[], [void], "nonpayable">;

  unpauseBot: TypedContractMethod<
    [botAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  updateBotCreationFee: TypedContractMethod<
    [newFee: BigNumberish],
    [void],
    "nonpayable"
  >;

  updateImplementation: TypedContractMethod<
    [newImplementation: AddressLike],
    [void],
    "nonpayable"
  >;

  updateInitPrice: TypedContractMethod<
    [newPrice: BigNumberish],
    [void],
    "nonpayable"
  >;

  upgradeToAndCall: TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;

  withdraw: TypedContractMethod<[], [bigint], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "UPGRADE_INTERFACE_VERSION"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "botCreationFee"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "bots"
  ): TypedContractMethod<
    [arg0: AddressLike],
    [
      [string, bigint, boolean] & {
        creator: string;
        createdAt: bigint;
        isActive: boolean;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "createBot"
  ): TypedContractMethod<
    [_creator: AddressLike, _instructionLengthFee: BigNumberish],
    [string],
    "payable"
  >;
  getFunction(
    nameOrSignature: "disbursement"
  ): TypedContractMethod<
    [botAddress: AddressLike, to: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "implementation"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "initPrice"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<
    [
      _implementation: AddressLike,
      _botCreationFee: BigNumberish,
      _initPrice: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "pause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "pauseBot"
  ): TypedContractMethod<[botAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "paused"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "proxiableUUID"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "totalBots"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "unpause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "unpauseBot"
  ): TypedContractMethod<[botAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateBotCreationFee"
  ): TypedContractMethod<[newFee: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateImplementation"
  ): TypedContractMethod<
    [newImplementation: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "updateInitPrice"
  ): TypedContractMethod<[newPrice: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "upgradeToAndCall"
  ): TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[], [bigint], "nonpayable">;

  getEvent(
    key: "BotCreated"
  ): TypedContractEvent<
    BotCreatedEvent.InputTuple,
    BotCreatedEvent.OutputTuple,
    BotCreatedEvent.OutputObject
  >;
  getEvent(
    key: "BotCreationFeeUpdated"
  ): TypedContractEvent<
    BotCreationFeeUpdatedEvent.InputTuple,
    BotCreationFeeUpdatedEvent.OutputTuple,
    BotCreationFeeUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "BotPaused"
  ): TypedContractEvent<
    BotPausedEvent.InputTuple,
    BotPausedEvent.OutputTuple,
    BotPausedEvent.OutputObject
  >;
  getEvent(
    key: "BotUnpaused"
  ): TypedContractEvent<
    BotUnpausedEvent.InputTuple,
    BotUnpausedEvent.OutputTuple,
    BotUnpausedEvent.OutputObject
  >;
  getEvent(
    key: "ImplementationUpdated"
  ): TypedContractEvent<
    ImplementationUpdatedEvent.InputTuple,
    ImplementationUpdatedEvent.OutputTuple,
    ImplementationUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "Paused"
  ): TypedContractEvent<
    PausedEvent.InputTuple,
    PausedEvent.OutputTuple,
    PausedEvent.OutputObject
  >;
  getEvent(
    key: "Unpaused"
  ): TypedContractEvent<
    UnpausedEvent.InputTuple,
    UnpausedEvent.OutputTuple,
    UnpausedEvent.OutputObject
  >;
  getEvent(
    key: "Upgraded"
  ): TypedContractEvent<
    UpgradedEvent.InputTuple,
    UpgradedEvent.OutputTuple,
    UpgradedEvent.OutputObject
  >;
  getEvent(
    key: "initPriceUpdated"
  ): TypedContractEvent<
    initPriceUpdatedEvent.InputTuple,
    initPriceUpdatedEvent.OutputTuple,
    initPriceUpdatedEvent.OutputObject
  >;

  filters: {
    "BotCreated(address,address,uint256)": TypedContractEvent<
      BotCreatedEvent.InputTuple,
      BotCreatedEvent.OutputTuple,
      BotCreatedEvent.OutputObject
    >;
    BotCreated: TypedContractEvent<
      BotCreatedEvent.InputTuple,
      BotCreatedEvent.OutputTuple,
      BotCreatedEvent.OutputObject
    >;

    "BotCreationFeeUpdated(uint256,uint256)": TypedContractEvent<
      BotCreationFeeUpdatedEvent.InputTuple,
      BotCreationFeeUpdatedEvent.OutputTuple,
      BotCreationFeeUpdatedEvent.OutputObject
    >;
    BotCreationFeeUpdated: TypedContractEvent<
      BotCreationFeeUpdatedEvent.InputTuple,
      BotCreationFeeUpdatedEvent.OutputTuple,
      BotCreationFeeUpdatedEvent.OutputObject
    >;

    "BotPaused(address)": TypedContractEvent<
      BotPausedEvent.InputTuple,
      BotPausedEvent.OutputTuple,
      BotPausedEvent.OutputObject
    >;
    BotPaused: TypedContractEvent<
      BotPausedEvent.InputTuple,
      BotPausedEvent.OutputTuple,
      BotPausedEvent.OutputObject
    >;

    "BotUnpaused(address)": TypedContractEvent<
      BotUnpausedEvent.InputTuple,
      BotUnpausedEvent.OutputTuple,
      BotUnpausedEvent.OutputObject
    >;
    BotUnpaused: TypedContractEvent<
      BotUnpausedEvent.InputTuple,
      BotUnpausedEvent.OutputTuple,
      BotUnpausedEvent.OutputObject
    >;

    "ImplementationUpdated(address,address)": TypedContractEvent<
      ImplementationUpdatedEvent.InputTuple,
      ImplementationUpdatedEvent.OutputTuple,
      ImplementationUpdatedEvent.OutputObject
    >;
    ImplementationUpdated: TypedContractEvent<
      ImplementationUpdatedEvent.InputTuple,
      ImplementationUpdatedEvent.OutputTuple,
      ImplementationUpdatedEvent.OutputObject
    >;

    "Initialized(uint64)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "Paused(address)": TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;
    Paused: TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;

    "Unpaused(address)": TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;
    Unpaused: TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;

    "Upgraded(address)": TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
    Upgraded: TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;

    "initPriceUpdated(uint256,uint256)": TypedContractEvent<
      initPriceUpdatedEvent.InputTuple,
      initPriceUpdatedEvent.OutputTuple,
      initPriceUpdatedEvent.OutputObject
    >;
    initPriceUpdated: TypedContractEvent<
      initPriceUpdatedEvent.InputTuple,
      initPriceUpdatedEvent.OutputTuple,
      initPriceUpdatedEvent.OutputObject
    >;
  };
}

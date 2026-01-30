export type EventPayload = Record<string,unknown>;

export interface DomainEvent<Ttype extends string, Tpayload extends EventPayload>{
      type: Ttype,
      payload: Tpayload,
      occuredAt: string
};

export interface EventMetadata {
      correlatioId?: string,
      causationId?: string,
      version?:number
};

export interface OutboundEvent<Ttype extends string, Tpayload extends EventPayload>
extends DomainEvent<Ttype, Tpayload>{
      metadata?:EventMetadata
}
export interface InboundEvent<Ttype extends string, Tpayload extends EventPayload>
extends DomainEvent<Ttype, Tpayload>{
      metadata?:EventMetadata
}


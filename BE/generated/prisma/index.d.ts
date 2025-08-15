
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Cart
 * 
 */
export type Cart = $Result.DefaultSelection<Prisma.$CartPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model CartItem
 * 
 */
export type CartItem = $Result.DefaultSelection<Prisma.$CartItemPayload>
/**
 * Model Clothes
 * 
 */
export type Clothes = $Result.DefaultSelection<Prisma.$ClothesPayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Image
 * 
 */
export type Image = $Result.DefaultSelection<Prisma.$ImagePayload>
/**
 * Model Comment
 * 
 */
export type Comment = $Result.DefaultSelection<Prisma.$CommentPayload>
/**
 * Model Coupon
 * 
 */
export type Coupon = $Result.DefaultSelection<Prisma.$CouponPayload>
/**
 * Model Shipping
 * 
 */
export type Shipping = $Result.DefaultSelection<Prisma.$ShippingPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model Report
 * 
 */
export type Report = $Result.DefaultSelection<Prisma.$ReportPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const State: {
  ORDERED: 'ORDERED',
  PENDING: 'PENDING'
};

export type State = (typeof State)[keyof typeof State]


export const Role: {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type State = $Enums.State

export const State: typeof $Enums.State

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Carts
 * const carts = await prisma.cart.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Carts
   * const carts = await prisma.cart.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.cart`: Exposes CRUD operations for the **Cart** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Carts
    * const carts = await prisma.cart.findMany()
    * ```
    */
  get cart(): Prisma.CartDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cartItem`: Exposes CRUD operations for the **CartItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CartItems
    * const cartItems = await prisma.cartItem.findMany()
    * ```
    */
  get cartItem(): Prisma.CartItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clothes`: Exposes CRUD operations for the **Clothes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clothes
    * const clothes = await prisma.clothes.findMany()
    * ```
    */
  get clothes(): Prisma.ClothesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.image`: Exposes CRUD operations for the **Image** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Images
    * const images = await prisma.image.findMany()
    * ```
    */
  get image(): Prisma.ImageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **Comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Comments
    * const comments = await prisma.comment.findMany()
    * ```
    */
  get comment(): Prisma.CommentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.coupon`: Exposes CRUD operations for the **Coupon** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Coupons
    * const coupons = await prisma.coupon.findMany()
    * ```
    */
  get coupon(): Prisma.CouponDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.shipping`: Exposes CRUD operations for the **Shipping** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Shippings
    * const shippings = await prisma.shipping.findMany()
    * ```
    */
  get shipping(): Prisma.ShippingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.report`: Exposes CRUD operations for the **Report** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reports
    * const reports = await prisma.report.findMany()
    * ```
    */
  get report(): Prisma.ReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.14.0
   * Query Engine version: 717184b7b35ea05dfa71a3236b7af656013e1e49
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Cart: 'Cart',
    User: 'User',
    CartItem: 'CartItem',
    Clothes: 'Clothes',
    Category: 'Category',
    Image: 'Image',
    Comment: 'Comment',
    Coupon: 'Coupon',
    Shipping: 'Shipping',
    Transaction: 'Transaction',
    Payment: 'Payment',
    Report: 'Report',
    Notification: 'Notification'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "cart" | "user" | "cartItem" | "clothes" | "category" | "image" | "comment" | "coupon" | "shipping" | "transaction" | "payment" | "report" | "notification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Cart: {
        payload: Prisma.$CartPayload<ExtArgs>
        fields: Prisma.CartFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CartFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CartFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>
          }
          findFirst: {
            args: Prisma.CartFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CartFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>
          }
          findMany: {
            args: Prisma.CartFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>[]
          }
          create: {
            args: Prisma.CartCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>
          }
          createMany: {
            args: Prisma.CartCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CartDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>
          }
          update: {
            args: Prisma.CartUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>
          }
          deleteMany: {
            args: Prisma.CartDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CartUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CartUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartPayload>
          }
          aggregate: {
            args: Prisma.CartAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCart>
          }
          groupBy: {
            args: Prisma.CartGroupByArgs<ExtArgs>
            result: $Utils.Optional<CartGroupByOutputType>[]
          }
          count: {
            args: Prisma.CartCountArgs<ExtArgs>
            result: $Utils.Optional<CartCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      CartItem: {
        payload: Prisma.$CartItemPayload<ExtArgs>
        fields: Prisma.CartItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CartItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CartItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          findFirst: {
            args: Prisma.CartItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CartItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          findMany: {
            args: Prisma.CartItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>[]
          }
          create: {
            args: Prisma.CartItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          createMany: {
            args: Prisma.CartItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CartItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          update: {
            args: Prisma.CartItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          deleteMany: {
            args: Prisma.CartItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CartItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CartItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CartItemPayload>
          }
          aggregate: {
            args: Prisma.CartItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCartItem>
          }
          groupBy: {
            args: Prisma.CartItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<CartItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.CartItemCountArgs<ExtArgs>
            result: $Utils.Optional<CartItemCountAggregateOutputType> | number
          }
        }
      }
      Clothes: {
        payload: Prisma.$ClothesPayload<ExtArgs>
        fields: Prisma.ClothesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClothesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClothesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothesPayload>
          }
          findFirst: {
            args: Prisma.ClothesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClothesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothesPayload>
          }
          findMany: {
            args: Prisma.ClothesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothesPayload>[]
          }
          create: {
            args: Prisma.ClothesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothesPayload>
          }
          createMany: {
            args: Prisma.ClothesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ClothesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothesPayload>
          }
          update: {
            args: Prisma.ClothesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothesPayload>
          }
          deleteMany: {
            args: Prisma.ClothesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClothesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClothesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClothesPayload>
          }
          aggregate: {
            args: Prisma.ClothesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClothes>
          }
          groupBy: {
            args: Prisma.ClothesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClothesGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClothesCountArgs<ExtArgs>
            result: $Utils.Optional<ClothesCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Image: {
        payload: Prisma.$ImagePayload<ExtArgs>
        fields: Prisma.ImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          findFirst: {
            args: Prisma.ImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          findMany: {
            args: Prisma.ImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>[]
          }
          create: {
            args: Prisma.ImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          createMany: {
            args: Prisma.ImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          update: {
            args: Prisma.ImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          deleteMany: {
            args: Prisma.ImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImagePayload>
          }
          aggregate: {
            args: Prisma.ImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImage>
          }
          groupBy: {
            args: Prisma.ImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImageCountArgs<ExtArgs>
            result: $Utils.Optional<ImageCountAggregateOutputType> | number
          }
        }
      }
      Comment: {
        payload: Prisma.$CommentPayload<ExtArgs>
        fields: Prisma.CommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findFirst: {
            args: Prisma.CommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findMany: {
            args: Prisma.CommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          create: {
            args: Prisma.CommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          createMany: {
            args: Prisma.CommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          update: {
            args: Prisma.CommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          deleteMany: {
            args: Prisma.CommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComment>
          }
          groupBy: {
            args: Prisma.CommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommentCountArgs<ExtArgs>
            result: $Utils.Optional<CommentCountAggregateOutputType> | number
          }
        }
      }
      Coupon: {
        payload: Prisma.$CouponPayload<ExtArgs>
        fields: Prisma.CouponFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CouponFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CouponFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          findFirst: {
            args: Prisma.CouponFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CouponFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          findMany: {
            args: Prisma.CouponFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>[]
          }
          create: {
            args: Prisma.CouponCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          createMany: {
            args: Prisma.CouponCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CouponDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          update: {
            args: Prisma.CouponUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          deleteMany: {
            args: Prisma.CouponDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CouponUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CouponUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          aggregate: {
            args: Prisma.CouponAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCoupon>
          }
          groupBy: {
            args: Prisma.CouponGroupByArgs<ExtArgs>
            result: $Utils.Optional<CouponGroupByOutputType>[]
          }
          count: {
            args: Prisma.CouponCountArgs<ExtArgs>
            result: $Utils.Optional<CouponCountAggregateOutputType> | number
          }
        }
      }
      Shipping: {
        payload: Prisma.$ShippingPayload<ExtArgs>
        fields: Prisma.ShippingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShippingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShippingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingPayload>
          }
          findFirst: {
            args: Prisma.ShippingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShippingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingPayload>
          }
          findMany: {
            args: Prisma.ShippingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingPayload>[]
          }
          create: {
            args: Prisma.ShippingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingPayload>
          }
          createMany: {
            args: Prisma.ShippingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ShippingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingPayload>
          }
          update: {
            args: Prisma.ShippingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingPayload>
          }
          deleteMany: {
            args: Prisma.ShippingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShippingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ShippingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingPayload>
          }
          aggregate: {
            args: Prisma.ShippingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShipping>
          }
          groupBy: {
            args: Prisma.ShippingGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShippingGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShippingCountArgs<ExtArgs>
            result: $Utils.Optional<ShippingCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      Report: {
        payload: Prisma.$ReportPayload<ExtArgs>
        fields: Prisma.ReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findFirst: {
            args: Prisma.ReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findMany: {
            args: Prisma.ReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          create: {
            args: Prisma.ReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          createMany: {
            args: Prisma.ReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          update: {
            args: Prisma.ReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          deleteMany: {
            args: Prisma.ReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          aggregate: {
            args: Prisma.ReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReport>
          }
          groupBy: {
            args: Prisma.ReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReportCountArgs<ExtArgs>
            result: $Utils.Optional<ReportCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    cart?: CartOmit
    user?: UserOmit
    cartItem?: CartItemOmit
    clothes?: ClothesOmit
    category?: CategoryOmit
    image?: ImageOmit
    comment?: CommentOmit
    coupon?: CouponOmit
    shipping?: ShippingOmit
    transaction?: TransactionOmit
    payment?: PaymentOmit
    report?: ReportOmit
    notification?: NotificationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CartCountOutputType
   */

  export type CartCountOutputType = {
    items: number
  }

  export type CartCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | CartCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * CartCountOutputType without action
   */
  export type CartCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartCountOutputType
     */
    select?: CartCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CartCountOutputType without action
   */
  export type CartCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartItemWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    carts: number
    Comment: number
    Shipping: number
    transactions: number
    Notification: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    carts?: boolean | UserCountOutputTypeCountCartsArgs
    Comment?: boolean | UserCountOutputTypeCountCommentArgs
    Shipping?: boolean | UserCountOutputTypeCountShippingArgs
    transactions?: boolean | UserCountOutputTypeCountTransactionsArgs
    Notification?: boolean | UserCountOutputTypeCountNotificationArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCartsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountShippingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShippingWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type ClothesCountOutputType
   */

  export type ClothesCountOutputType = {
    cartItems: number
    Category: number
    comments: number
  }

  export type ClothesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cartItems?: boolean | ClothesCountOutputTypeCountCartItemsArgs
    Category?: boolean | ClothesCountOutputTypeCountCategoryArgs
    comments?: boolean | ClothesCountOutputTypeCountCommentsArgs
  }

  // Custom InputTypes
  /**
   * ClothesCountOutputType without action
   */
  export type ClothesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClothesCountOutputType
     */
    select?: ClothesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClothesCountOutputType without action
   */
  export type ClothesCountOutputTypeCountCartItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartItemWhereInput
  }

  /**
   * ClothesCountOutputType without action
   */
  export type ClothesCountOutputTypeCountCategoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
  }

  /**
   * ClothesCountOutputType without action
   */
  export type ClothesCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }


  /**
   * Count Type CouponCountOutputType
   */

  export type CouponCountOutputType = {
    user: number
  }

  export type CouponCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | CouponCountOutputTypeCountUserArgs
  }

  // Custom InputTypes
  /**
   * CouponCountOutputType without action
   */
  export type CouponCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CouponCountOutputType
     */
    select?: CouponCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CouponCountOutputType without action
   */
  export type CouponCountOutputTypeCountUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type TransactionCountOutputType
   */

  export type TransactionCountOutputType = {
    Shipping: number
    Report: number
  }

  export type TransactionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Shipping?: boolean | TransactionCountOutputTypeCountShippingArgs
    Report?: boolean | TransactionCountOutputTypeCountReportArgs
  }

  // Custom InputTypes
  /**
   * TransactionCountOutputType without action
   */
  export type TransactionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionCountOutputType
     */
    select?: TransactionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TransactionCountOutputType without action
   */
  export type TransactionCountOutputTypeCountShippingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShippingWhereInput
  }

  /**
   * TransactionCountOutputType without action
   */
  export type TransactionCountOutputTypeCountReportArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportWhereInput
  }


  /**
   * Count Type PaymentCountOutputType
   */

  export type PaymentCountOutputType = {
    Transaction: number
  }

  export type PaymentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Transaction?: boolean | PaymentCountOutputTypeCountTransactionArgs
  }

  // Custom InputTypes
  /**
   * PaymentCountOutputType without action
   */
  export type PaymentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentCountOutputType
     */
    select?: PaymentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PaymentCountOutputType without action
   */
  export type PaymentCountOutputTypeCountTransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Cart
   */

  export type AggregateCart = {
    _count: CartCountAggregateOutputType | null
    _avg: CartAvgAggregateOutputType | null
    _sum: CartSumAggregateOutputType | null
    _min: CartMinAggregateOutputType | null
    _max: CartMaxAggregateOutputType | null
  }

  export type CartAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type CartSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type CartMinAggregateOutputType = {
    id: number | null
    userId: number | null
    state: $Enums.State | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CartMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    state: $Enums.State | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CartCountAggregateOutputType = {
    id: number
    userId: number
    state: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CartAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type CartSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type CartMinAggregateInputType = {
    id?: true
    userId?: true
    state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CartMaxAggregateInputType = {
    id?: true
    userId?: true
    state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CartCountAggregateInputType = {
    id?: true
    userId?: true
    state?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CartAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cart to aggregate.
     */
    where?: CartWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Carts to fetch.
     */
    orderBy?: CartOrderByWithRelationInput | CartOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CartWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Carts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Carts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Carts
    **/
    _count?: true | CartCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CartAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CartSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CartMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CartMaxAggregateInputType
  }

  export type GetCartAggregateType<T extends CartAggregateArgs> = {
        [P in keyof T & keyof AggregateCart]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCart[P]>
      : GetScalarType<T[P], AggregateCart[P]>
  }




  export type CartGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartWhereInput
    orderBy?: CartOrderByWithAggregationInput | CartOrderByWithAggregationInput[]
    by: CartScalarFieldEnum[] | CartScalarFieldEnum
    having?: CartScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CartCountAggregateInputType | true
    _avg?: CartAvgAggregateInputType
    _sum?: CartSumAggregateInputType
    _min?: CartMinAggregateInputType
    _max?: CartMaxAggregateInputType
  }

  export type CartGroupByOutputType = {
    id: number
    userId: number
    state: $Enums.State
    createdAt: Date
    updatedAt: Date
    _count: CartCountAggregateOutputType | null
    _avg: CartAvgAggregateOutputType | null
    _sum: CartSumAggregateOutputType | null
    _min: CartMinAggregateOutputType | null
    _max: CartMaxAggregateOutputType | null
  }

  type GetCartGroupByPayload<T extends CartGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CartGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CartGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CartGroupByOutputType[P]>
            : GetScalarType<T[P], CartGroupByOutputType[P]>
        }
      >
    >


  export type CartSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    items?: boolean | Cart$itemsArgs<ExtArgs>
    _count?: boolean | CartCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cart"]>



  export type CartSelectScalar = {
    id?: boolean
    userId?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CartOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "state" | "createdAt" | "updatedAt", ExtArgs["result"]["cart"]>
  export type CartInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    items?: boolean | Cart$itemsArgs<ExtArgs>
    _count?: boolean | CartCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CartPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cart"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      items: Prisma.$CartItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      state: $Enums.State
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cart"]>
    composites: {}
  }

  type CartGetPayload<S extends boolean | null | undefined | CartDefaultArgs> = $Result.GetResult<Prisma.$CartPayload, S>

  type CartCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CartFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CartCountAggregateInputType | true
    }

  export interface CartDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cart'], meta: { name: 'Cart' } }
    /**
     * Find zero or one Cart that matches the filter.
     * @param {CartFindUniqueArgs} args - Arguments to find a Cart
     * @example
     * // Get one Cart
     * const cart = await prisma.cart.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CartFindUniqueArgs>(args: SelectSubset<T, CartFindUniqueArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Cart that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CartFindUniqueOrThrowArgs} args - Arguments to find a Cart
     * @example
     * // Get one Cart
     * const cart = await prisma.cart.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CartFindUniqueOrThrowArgs>(args: SelectSubset<T, CartFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cart that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartFindFirstArgs} args - Arguments to find a Cart
     * @example
     * // Get one Cart
     * const cart = await prisma.cart.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CartFindFirstArgs>(args?: SelectSubset<T, CartFindFirstArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cart that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartFindFirstOrThrowArgs} args - Arguments to find a Cart
     * @example
     * // Get one Cart
     * const cart = await prisma.cart.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CartFindFirstOrThrowArgs>(args?: SelectSubset<T, CartFindFirstOrThrowArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Carts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Carts
     * const carts = await prisma.cart.findMany()
     * 
     * // Get first 10 Carts
     * const carts = await prisma.cart.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cartWithIdOnly = await prisma.cart.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CartFindManyArgs>(args?: SelectSubset<T, CartFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Cart.
     * @param {CartCreateArgs} args - Arguments to create a Cart.
     * @example
     * // Create one Cart
     * const Cart = await prisma.cart.create({
     *   data: {
     *     // ... data to create a Cart
     *   }
     * })
     * 
     */
    create<T extends CartCreateArgs>(args: SelectSubset<T, CartCreateArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Carts.
     * @param {CartCreateManyArgs} args - Arguments to create many Carts.
     * @example
     * // Create many Carts
     * const cart = await prisma.cart.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CartCreateManyArgs>(args?: SelectSubset<T, CartCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Cart.
     * @param {CartDeleteArgs} args - Arguments to delete one Cart.
     * @example
     * // Delete one Cart
     * const Cart = await prisma.cart.delete({
     *   where: {
     *     // ... filter to delete one Cart
     *   }
     * })
     * 
     */
    delete<T extends CartDeleteArgs>(args: SelectSubset<T, CartDeleteArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Cart.
     * @param {CartUpdateArgs} args - Arguments to update one Cart.
     * @example
     * // Update one Cart
     * const cart = await prisma.cart.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CartUpdateArgs>(args: SelectSubset<T, CartUpdateArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Carts.
     * @param {CartDeleteManyArgs} args - Arguments to filter Carts to delete.
     * @example
     * // Delete a few Carts
     * const { count } = await prisma.cart.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CartDeleteManyArgs>(args?: SelectSubset<T, CartDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Carts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Carts
     * const cart = await prisma.cart.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CartUpdateManyArgs>(args: SelectSubset<T, CartUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Cart.
     * @param {CartUpsertArgs} args - Arguments to update or create a Cart.
     * @example
     * // Update or create a Cart
     * const cart = await prisma.cart.upsert({
     *   create: {
     *     // ... data to create a Cart
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cart we want to update
     *   }
     * })
     */
    upsert<T extends CartUpsertArgs>(args: SelectSubset<T, CartUpsertArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Carts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartCountArgs} args - Arguments to filter Carts to count.
     * @example
     * // Count the number of Carts
     * const count = await prisma.cart.count({
     *   where: {
     *     // ... the filter for the Carts we want to count
     *   }
     * })
    **/
    count<T extends CartCountArgs>(
      args?: Subset<T, CartCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CartCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cart.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CartAggregateArgs>(args: Subset<T, CartAggregateArgs>): Prisma.PrismaPromise<GetCartAggregateType<T>>

    /**
     * Group by Cart.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CartGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CartGroupByArgs['orderBy'] }
        : { orderBy?: CartGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CartGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCartGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cart model
   */
  readonly fields: CartFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cart.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CartClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    items<T extends Cart$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Cart$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Cart model
   */
  interface CartFieldRefs {
    readonly id: FieldRef<"Cart", 'Int'>
    readonly userId: FieldRef<"Cart", 'Int'>
    readonly state: FieldRef<"Cart", 'State'>
    readonly createdAt: FieldRef<"Cart", 'DateTime'>
    readonly updatedAt: FieldRef<"Cart", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cart findUnique
   */
  export type CartFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cart
     */
    omit?: CartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * Filter, which Cart to fetch.
     */
    where: CartWhereUniqueInput
  }

  /**
   * Cart findUniqueOrThrow
   */
  export type CartFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cart
     */
    omit?: CartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * Filter, which Cart to fetch.
     */
    where: CartWhereUniqueInput
  }

  /**
   * Cart findFirst
   */
  export type CartFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cart
     */
    omit?: CartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * Filter, which Cart to fetch.
     */
    where?: CartWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Carts to fetch.
     */
    orderBy?: CartOrderByWithRelationInput | CartOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Carts.
     */
    cursor?: CartWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Carts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Carts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Carts.
     */
    distinct?: CartScalarFieldEnum | CartScalarFieldEnum[]
  }

  /**
   * Cart findFirstOrThrow
   */
  export type CartFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cart
     */
    omit?: CartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * Filter, which Cart to fetch.
     */
    where?: CartWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Carts to fetch.
     */
    orderBy?: CartOrderByWithRelationInput | CartOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Carts.
     */
    cursor?: CartWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Carts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Carts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Carts.
     */
    distinct?: CartScalarFieldEnum | CartScalarFieldEnum[]
  }

  /**
   * Cart findMany
   */
  export type CartFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cart
     */
    omit?: CartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * Filter, which Carts to fetch.
     */
    where?: CartWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Carts to fetch.
     */
    orderBy?: CartOrderByWithRelationInput | CartOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Carts.
     */
    cursor?: CartWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Carts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Carts.
     */
    skip?: number
    distinct?: CartScalarFieldEnum | CartScalarFieldEnum[]
  }

  /**
   * Cart create
   */
  export type CartCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cart
     */
    omit?: CartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * The data needed to create a Cart.
     */
    data: XOR<CartCreateInput, CartUncheckedCreateInput>
  }

  /**
   * Cart createMany
   */
  export type CartCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Carts.
     */
    data: CartCreateManyInput | CartCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cart update
   */
  export type CartUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cart
     */
    omit?: CartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * The data needed to update a Cart.
     */
    data: XOR<CartUpdateInput, CartUncheckedUpdateInput>
    /**
     * Choose, which Cart to update.
     */
    where: CartWhereUniqueInput
  }

  /**
   * Cart updateMany
   */
  export type CartUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Carts.
     */
    data: XOR<CartUpdateManyMutationInput, CartUncheckedUpdateManyInput>
    /**
     * Filter which Carts to update
     */
    where?: CartWhereInput
    /**
     * Limit how many Carts to update.
     */
    limit?: number
  }

  /**
   * Cart upsert
   */
  export type CartUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cart
     */
    omit?: CartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * The filter to search for the Cart to update in case it exists.
     */
    where: CartWhereUniqueInput
    /**
     * In case the Cart found by the `where` argument doesn't exist, create a new Cart with this data.
     */
    create: XOR<CartCreateInput, CartUncheckedCreateInput>
    /**
     * In case the Cart was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CartUpdateInput, CartUncheckedUpdateInput>
  }

  /**
   * Cart delete
   */
  export type CartDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cart
     */
    omit?: CartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    /**
     * Filter which Cart to delete.
     */
    where: CartWhereUniqueInput
  }

  /**
   * Cart deleteMany
   */
  export type CartDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Carts to delete
     */
    where?: CartWhereInput
    /**
     * Limit how many Carts to delete.
     */
    limit?: number
  }

  /**
   * Cart.items
   */
  export type Cart$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    where?: CartItemWhereInput
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    cursor?: CartItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * Cart without action
   */
  export type CartDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cart
     */
    omit?: CartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    phone: string | null
    address: string | null
    role: $Enums.Role | null
    couponCode: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    phone: string | null
    address: string | null
    role: $Enums.Role | null
    couponCode: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    phone: number
    address: number
    role: number
    couponCode: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    phone?: true
    address?: true
    role?: true
    couponCode?: true
    updatedAt?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    phone?: true
    address?: true
    role?: true
    couponCode?: true
    updatedAt?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    phone?: true
    address?: true
    role?: true
    couponCode?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    name: string
    email: string
    password: string
    phone: string
    address: string
    role: $Enums.Role
    couponCode: string | null
    updatedAt: Date
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    phone?: boolean
    address?: boolean
    role?: boolean
    couponCode?: boolean
    updatedAt?: boolean
    createdAt?: boolean
    carts?: boolean | User$cartsArgs<ExtArgs>
    coupon?: boolean | User$couponArgs<ExtArgs>
    Comment?: boolean | User$CommentArgs<ExtArgs>
    Shipping?: boolean | User$ShippingArgs<ExtArgs>
    transactions?: boolean | User$transactionsArgs<ExtArgs>
    Notification?: boolean | User$NotificationArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    phone?: boolean
    address?: boolean
    role?: boolean
    couponCode?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "phone" | "address" | "role" | "couponCode" | "updatedAt" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    carts?: boolean | User$cartsArgs<ExtArgs>
    coupon?: boolean | User$couponArgs<ExtArgs>
    Comment?: boolean | User$CommentArgs<ExtArgs>
    Shipping?: boolean | User$ShippingArgs<ExtArgs>
    transactions?: boolean | User$transactionsArgs<ExtArgs>
    Notification?: boolean | User$NotificationArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      carts: Prisma.$CartPayload<ExtArgs>[]
      coupon: Prisma.$CouponPayload<ExtArgs> | null
      Comment: Prisma.$CommentPayload<ExtArgs>[]
      Shipping: Prisma.$ShippingPayload<ExtArgs>[]
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
      Notification: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      email: string
      password: string
      phone: string
      address: string
      role: $Enums.Role
      couponCode: string | null
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    carts<T extends User$cartsArgs<ExtArgs> = {}>(args?: Subset<T, User$cartsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    coupon<T extends User$couponArgs<ExtArgs> = {}>(args?: Subset<T, User$couponArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    Comment<T extends User$CommentArgs<ExtArgs> = {}>(args?: Subset<T, User$CommentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Shipping<T extends User$ShippingArgs<ExtArgs> = {}>(args?: Subset<T, User$ShippingArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShippingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactions<T extends User$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Notification<T extends User$NotificationArgs<ExtArgs> = {}>(args?: Subset<T, User$NotificationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly couponCode: FieldRef<"User", 'String'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.carts
   */
  export type User$cartsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cart
     */
    select?: CartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cart
     */
    omit?: CartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartInclude<ExtArgs> | null
    where?: CartWhereInput
    orderBy?: CartOrderByWithRelationInput | CartOrderByWithRelationInput[]
    cursor?: CartWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CartScalarFieldEnum | CartScalarFieldEnum[]
  }

  /**
   * User.coupon
   */
  export type User$couponArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    where?: CouponWhereInput
  }

  /**
   * User.Comment
   */
  export type User$CommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * User.Shipping
   */
  export type User$ShippingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipping
     */
    select?: ShippingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipping
     */
    omit?: ShippingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingInclude<ExtArgs> | null
    where?: ShippingWhereInput
    orderBy?: ShippingOrderByWithRelationInput | ShippingOrderByWithRelationInput[]
    cursor?: ShippingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShippingScalarFieldEnum | ShippingScalarFieldEnum[]
  }

  /**
   * User.transactions
   */
  export type User$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * User.Notification
   */
  export type User$NotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model CartItem
   */

  export type AggregateCartItem = {
    _count: CartItemCountAggregateOutputType | null
    _avg: CartItemAvgAggregateOutputType | null
    _sum: CartItemSumAggregateOutputType | null
    _min: CartItemMinAggregateOutputType | null
    _max: CartItemMaxAggregateOutputType | null
  }

  export type CartItemAvgAggregateOutputType = {
    id: number | null
    cartId: number | null
    clothesId: number | null
    totalprice: number | null
    quantity: number | null
  }

  export type CartItemSumAggregateOutputType = {
    id: number | null
    cartId: number | null
    clothesId: number | null
    totalprice: number | null
    quantity: number | null
  }

  export type CartItemMinAggregateOutputType = {
    id: number | null
    cartId: number | null
    clothesId: number | null
    totalprice: number | null
    quantity: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CartItemMaxAggregateOutputType = {
    id: number | null
    cartId: number | null
    clothesId: number | null
    totalprice: number | null
    quantity: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CartItemCountAggregateOutputType = {
    id: number
    cartId: number
    clothesId: number
    totalprice: number
    quantity: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CartItemAvgAggregateInputType = {
    id?: true
    cartId?: true
    clothesId?: true
    totalprice?: true
    quantity?: true
  }

  export type CartItemSumAggregateInputType = {
    id?: true
    cartId?: true
    clothesId?: true
    totalprice?: true
    quantity?: true
  }

  export type CartItemMinAggregateInputType = {
    id?: true
    cartId?: true
    clothesId?: true
    totalprice?: true
    quantity?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CartItemMaxAggregateInputType = {
    id?: true
    cartId?: true
    clothesId?: true
    totalprice?: true
    quantity?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CartItemCountAggregateInputType = {
    id?: true
    cartId?: true
    clothesId?: true
    totalprice?: true
    quantity?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CartItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CartItem to aggregate.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CartItems
    **/
    _count?: true | CartItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CartItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CartItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CartItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CartItemMaxAggregateInputType
  }

  export type GetCartItemAggregateType<T extends CartItemAggregateArgs> = {
        [P in keyof T & keyof AggregateCartItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCartItem[P]>
      : GetScalarType<T[P], AggregateCartItem[P]>
  }




  export type CartItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CartItemWhereInput
    orderBy?: CartItemOrderByWithAggregationInput | CartItemOrderByWithAggregationInput[]
    by: CartItemScalarFieldEnum[] | CartItemScalarFieldEnum
    having?: CartItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CartItemCountAggregateInputType | true
    _avg?: CartItemAvgAggregateInputType
    _sum?: CartItemSumAggregateInputType
    _min?: CartItemMinAggregateInputType
    _max?: CartItemMaxAggregateInputType
  }

  export type CartItemGroupByOutputType = {
    id: number
    cartId: number
    clothesId: number
    totalprice: number
    quantity: number
    createdAt: Date
    updatedAt: Date
    _count: CartItemCountAggregateOutputType | null
    _avg: CartItemAvgAggregateOutputType | null
    _sum: CartItemSumAggregateOutputType | null
    _min: CartItemMinAggregateOutputType | null
    _max: CartItemMaxAggregateOutputType | null
  }

  type GetCartItemGroupByPayload<T extends CartItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CartItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CartItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CartItemGroupByOutputType[P]>
            : GetScalarType<T[P], CartItemGroupByOutputType[P]>
        }
      >
    >


  export type CartItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cartId?: boolean
    clothesId?: boolean
    totalprice?: boolean
    quantity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clothes?: boolean | ClothesDefaultArgs<ExtArgs>
    cart?: boolean | CartDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cartItem"]>



  export type CartItemSelectScalar = {
    id?: boolean
    cartId?: boolean
    clothesId?: boolean
    totalprice?: boolean
    quantity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CartItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cartId" | "clothesId" | "totalprice" | "quantity" | "createdAt" | "updatedAt", ExtArgs["result"]["cartItem"]>
  export type CartItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clothes?: boolean | ClothesDefaultArgs<ExtArgs>
    cart?: boolean | CartDefaultArgs<ExtArgs>
  }

  export type $CartItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CartItem"
    objects: {
      clothes: Prisma.$ClothesPayload<ExtArgs>
      cart: Prisma.$CartPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      cartId: number
      clothesId: number
      totalprice: number
      quantity: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cartItem"]>
    composites: {}
  }

  type CartItemGetPayload<S extends boolean | null | undefined | CartItemDefaultArgs> = $Result.GetResult<Prisma.$CartItemPayload, S>

  type CartItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CartItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CartItemCountAggregateInputType | true
    }

  export interface CartItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CartItem'], meta: { name: 'CartItem' } }
    /**
     * Find zero or one CartItem that matches the filter.
     * @param {CartItemFindUniqueArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CartItemFindUniqueArgs>(args: SelectSubset<T, CartItemFindUniqueArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CartItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CartItemFindUniqueOrThrowArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CartItemFindUniqueOrThrowArgs>(args: SelectSubset<T, CartItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CartItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindFirstArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CartItemFindFirstArgs>(args?: SelectSubset<T, CartItemFindFirstArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CartItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindFirstOrThrowArgs} args - Arguments to find a CartItem
     * @example
     * // Get one CartItem
     * const cartItem = await prisma.cartItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CartItemFindFirstOrThrowArgs>(args?: SelectSubset<T, CartItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CartItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CartItems
     * const cartItems = await prisma.cartItem.findMany()
     * 
     * // Get first 10 CartItems
     * const cartItems = await prisma.cartItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cartItemWithIdOnly = await prisma.cartItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CartItemFindManyArgs>(args?: SelectSubset<T, CartItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CartItem.
     * @param {CartItemCreateArgs} args - Arguments to create a CartItem.
     * @example
     * // Create one CartItem
     * const CartItem = await prisma.cartItem.create({
     *   data: {
     *     // ... data to create a CartItem
     *   }
     * })
     * 
     */
    create<T extends CartItemCreateArgs>(args: SelectSubset<T, CartItemCreateArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CartItems.
     * @param {CartItemCreateManyArgs} args - Arguments to create many CartItems.
     * @example
     * // Create many CartItems
     * const cartItem = await prisma.cartItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CartItemCreateManyArgs>(args?: SelectSubset<T, CartItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CartItem.
     * @param {CartItemDeleteArgs} args - Arguments to delete one CartItem.
     * @example
     * // Delete one CartItem
     * const CartItem = await prisma.cartItem.delete({
     *   where: {
     *     // ... filter to delete one CartItem
     *   }
     * })
     * 
     */
    delete<T extends CartItemDeleteArgs>(args: SelectSubset<T, CartItemDeleteArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CartItem.
     * @param {CartItemUpdateArgs} args - Arguments to update one CartItem.
     * @example
     * // Update one CartItem
     * const cartItem = await prisma.cartItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CartItemUpdateArgs>(args: SelectSubset<T, CartItemUpdateArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CartItems.
     * @param {CartItemDeleteManyArgs} args - Arguments to filter CartItems to delete.
     * @example
     * // Delete a few CartItems
     * const { count } = await prisma.cartItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CartItemDeleteManyArgs>(args?: SelectSubset<T, CartItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CartItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CartItems
     * const cartItem = await prisma.cartItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CartItemUpdateManyArgs>(args: SelectSubset<T, CartItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CartItem.
     * @param {CartItemUpsertArgs} args - Arguments to update or create a CartItem.
     * @example
     * // Update or create a CartItem
     * const cartItem = await prisma.cartItem.upsert({
     *   create: {
     *     // ... data to create a CartItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CartItem we want to update
     *   }
     * })
     */
    upsert<T extends CartItemUpsertArgs>(args: SelectSubset<T, CartItemUpsertArgs<ExtArgs>>): Prisma__CartItemClient<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CartItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemCountArgs} args - Arguments to filter CartItems to count.
     * @example
     * // Count the number of CartItems
     * const count = await prisma.cartItem.count({
     *   where: {
     *     // ... the filter for the CartItems we want to count
     *   }
     * })
    **/
    count<T extends CartItemCountArgs>(
      args?: Subset<T, CartItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CartItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CartItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CartItemAggregateArgs>(args: Subset<T, CartItemAggregateArgs>): Prisma.PrismaPromise<GetCartItemAggregateType<T>>

    /**
     * Group by CartItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CartItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CartItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CartItemGroupByArgs['orderBy'] }
        : { orderBy?: CartItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CartItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCartItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CartItem model
   */
  readonly fields: CartItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CartItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CartItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clothes<T extends ClothesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClothesDefaultArgs<ExtArgs>>): Prisma__ClothesClient<$Result.GetResult<Prisma.$ClothesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    cart<T extends CartDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CartDefaultArgs<ExtArgs>>): Prisma__CartClient<$Result.GetResult<Prisma.$CartPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CartItem model
   */
  interface CartItemFieldRefs {
    readonly id: FieldRef<"CartItem", 'Int'>
    readonly cartId: FieldRef<"CartItem", 'Int'>
    readonly clothesId: FieldRef<"CartItem", 'Int'>
    readonly totalprice: FieldRef<"CartItem", 'Float'>
    readonly quantity: FieldRef<"CartItem", 'Int'>
    readonly createdAt: FieldRef<"CartItem", 'DateTime'>
    readonly updatedAt: FieldRef<"CartItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CartItem findUnique
   */
  export type CartItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem findUniqueOrThrow
   */
  export type CartItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem findFirst
   */
  export type CartItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CartItems.
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CartItems.
     */
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * CartItem findFirstOrThrow
   */
  export type CartItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItem to fetch.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CartItems.
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CartItems.
     */
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * CartItem findMany
   */
  export type CartItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter, which CartItems to fetch.
     */
    where?: CartItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CartItems to fetch.
     */
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CartItems.
     */
    cursor?: CartItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CartItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CartItems.
     */
    skip?: number
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * CartItem create
   */
  export type CartItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * The data needed to create a CartItem.
     */
    data: XOR<CartItemCreateInput, CartItemUncheckedCreateInput>
  }

  /**
   * CartItem createMany
   */
  export type CartItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CartItems.
     */
    data: CartItemCreateManyInput | CartItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CartItem update
   */
  export type CartItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * The data needed to update a CartItem.
     */
    data: XOR<CartItemUpdateInput, CartItemUncheckedUpdateInput>
    /**
     * Choose, which CartItem to update.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem updateMany
   */
  export type CartItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CartItems.
     */
    data: XOR<CartItemUpdateManyMutationInput, CartItemUncheckedUpdateManyInput>
    /**
     * Filter which CartItems to update
     */
    where?: CartItemWhereInput
    /**
     * Limit how many CartItems to update.
     */
    limit?: number
  }

  /**
   * CartItem upsert
   */
  export type CartItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * The filter to search for the CartItem to update in case it exists.
     */
    where: CartItemWhereUniqueInput
    /**
     * In case the CartItem found by the `where` argument doesn't exist, create a new CartItem with this data.
     */
    create: XOR<CartItemCreateInput, CartItemUncheckedCreateInput>
    /**
     * In case the CartItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CartItemUpdateInput, CartItemUncheckedUpdateInput>
  }

  /**
   * CartItem delete
   */
  export type CartItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    /**
     * Filter which CartItem to delete.
     */
    where: CartItemWhereUniqueInput
  }

  /**
   * CartItem deleteMany
   */
  export type CartItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CartItems to delete
     */
    where?: CartItemWhereInput
    /**
     * Limit how many CartItems to delete.
     */
    limit?: number
  }

  /**
   * CartItem without action
   */
  export type CartItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
  }


  /**
   * Model Clothes
   */

  export type AggregateClothes = {
    _count: ClothesCountAggregateOutputType | null
    _avg: ClothesAvgAggregateOutputType | null
    _sum: ClothesSumAggregateOutputType | null
    _min: ClothesMinAggregateOutputType | null
    _max: ClothesMaxAggregateOutputType | null
  }

  export type ClothesAvgAggregateOutputType = {
    id: number | null
    price: number | null
    count: number | null
    mainImgId: number | null
  }

  export type ClothesSumAggregateOutputType = {
    id: number | null
    price: number | null
    count: number | null
    mainImgId: number | null
  }

  export type ClothesMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    price: number | null
    count: number | null
    Color: string | null
    mainImgId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClothesMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    price: number | null
    count: number | null
    Color: string | null
    mainImgId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClothesCountAggregateOutputType = {
    id: number
    name: number
    description: number
    price: number
    count: number
    Color: number
    mainImgId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClothesAvgAggregateInputType = {
    id?: true
    price?: true
    count?: true
    mainImgId?: true
  }

  export type ClothesSumAggregateInputType = {
    id?: true
    price?: true
    count?: true
    mainImgId?: true
  }

  export type ClothesMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    count?: true
    Color?: true
    mainImgId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClothesMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    count?: true
    Color?: true
    mainImgId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClothesCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    price?: true
    count?: true
    Color?: true
    mainImgId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClothesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clothes to aggregate.
     */
    where?: ClothesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clothes to fetch.
     */
    orderBy?: ClothesOrderByWithRelationInput | ClothesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClothesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clothes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clothes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clothes
    **/
    _count?: true | ClothesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClothesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClothesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClothesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClothesMaxAggregateInputType
  }

  export type GetClothesAggregateType<T extends ClothesAggregateArgs> = {
        [P in keyof T & keyof AggregateClothes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClothes[P]>
      : GetScalarType<T[P], AggregateClothes[P]>
  }




  export type ClothesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClothesWhereInput
    orderBy?: ClothesOrderByWithAggregationInput | ClothesOrderByWithAggregationInput[]
    by: ClothesScalarFieldEnum[] | ClothesScalarFieldEnum
    having?: ClothesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClothesCountAggregateInputType | true
    _avg?: ClothesAvgAggregateInputType
    _sum?: ClothesSumAggregateInputType
    _min?: ClothesMinAggregateInputType
    _max?: ClothesMaxAggregateInputType
  }

  export type ClothesGroupByOutputType = {
    id: number
    name: string
    description: string
    price: number
    count: number
    Color: string
    mainImgId: number | null
    createdAt: Date
    updatedAt: Date
    _count: ClothesCountAggregateOutputType | null
    _avg: ClothesAvgAggregateOutputType | null
    _sum: ClothesSumAggregateOutputType | null
    _min: ClothesMinAggregateOutputType | null
    _max: ClothesMaxAggregateOutputType | null
  }

  type GetClothesGroupByPayload<T extends ClothesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClothesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClothesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClothesGroupByOutputType[P]>
            : GetScalarType<T[P], ClothesGroupByOutputType[P]>
        }
      >
    >


  export type ClothesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    count?: boolean
    Color?: boolean
    mainImgId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cartItems?: boolean | Clothes$cartItemsArgs<ExtArgs>
    mainImg?: boolean | Clothes$mainImgArgs<ExtArgs>
    Category?: boolean | Clothes$CategoryArgs<ExtArgs>
    comments?: boolean | Clothes$commentsArgs<ExtArgs>
    _count?: boolean | ClothesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clothes"]>



  export type ClothesSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    count?: boolean
    Color?: boolean
    mainImgId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClothesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "price" | "count" | "Color" | "mainImgId" | "createdAt" | "updatedAt", ExtArgs["result"]["clothes"]>
  export type ClothesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cartItems?: boolean | Clothes$cartItemsArgs<ExtArgs>
    mainImg?: boolean | Clothes$mainImgArgs<ExtArgs>
    Category?: boolean | Clothes$CategoryArgs<ExtArgs>
    comments?: boolean | Clothes$commentsArgs<ExtArgs>
    _count?: boolean | ClothesCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ClothesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Clothes"
    objects: {
      cartItems: Prisma.$CartItemPayload<ExtArgs>[]
      mainImg: Prisma.$ImagePayload<ExtArgs> | null
      Category: Prisma.$CategoryPayload<ExtArgs>[]
      comments: Prisma.$CommentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      description: string
      price: number
      count: number
      Color: string
      mainImgId: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["clothes"]>
    composites: {}
  }

  type ClothesGetPayload<S extends boolean | null | undefined | ClothesDefaultArgs> = $Result.GetResult<Prisma.$ClothesPayload, S>

  type ClothesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClothesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClothesCountAggregateInputType | true
    }

  export interface ClothesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Clothes'], meta: { name: 'Clothes' } }
    /**
     * Find zero or one Clothes that matches the filter.
     * @param {ClothesFindUniqueArgs} args - Arguments to find a Clothes
     * @example
     * // Get one Clothes
     * const clothes = await prisma.clothes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClothesFindUniqueArgs>(args: SelectSubset<T, ClothesFindUniqueArgs<ExtArgs>>): Prisma__ClothesClient<$Result.GetResult<Prisma.$ClothesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Clothes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClothesFindUniqueOrThrowArgs} args - Arguments to find a Clothes
     * @example
     * // Get one Clothes
     * const clothes = await prisma.clothes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClothesFindUniqueOrThrowArgs>(args: SelectSubset<T, ClothesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClothesClient<$Result.GetResult<Prisma.$ClothesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Clothes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothesFindFirstArgs} args - Arguments to find a Clothes
     * @example
     * // Get one Clothes
     * const clothes = await prisma.clothes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClothesFindFirstArgs>(args?: SelectSubset<T, ClothesFindFirstArgs<ExtArgs>>): Prisma__ClothesClient<$Result.GetResult<Prisma.$ClothesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Clothes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothesFindFirstOrThrowArgs} args - Arguments to find a Clothes
     * @example
     * // Get one Clothes
     * const clothes = await prisma.clothes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClothesFindFirstOrThrowArgs>(args?: SelectSubset<T, ClothesFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClothesClient<$Result.GetResult<Prisma.$ClothesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clothes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clothes
     * const clothes = await prisma.clothes.findMany()
     * 
     * // Get first 10 Clothes
     * const clothes = await prisma.clothes.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clothesWithIdOnly = await prisma.clothes.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClothesFindManyArgs>(args?: SelectSubset<T, ClothesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClothesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Clothes.
     * @param {ClothesCreateArgs} args - Arguments to create a Clothes.
     * @example
     * // Create one Clothes
     * const Clothes = await prisma.clothes.create({
     *   data: {
     *     // ... data to create a Clothes
     *   }
     * })
     * 
     */
    create<T extends ClothesCreateArgs>(args: SelectSubset<T, ClothesCreateArgs<ExtArgs>>): Prisma__ClothesClient<$Result.GetResult<Prisma.$ClothesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clothes.
     * @param {ClothesCreateManyArgs} args - Arguments to create many Clothes.
     * @example
     * // Create many Clothes
     * const clothes = await prisma.clothes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClothesCreateManyArgs>(args?: SelectSubset<T, ClothesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Clothes.
     * @param {ClothesDeleteArgs} args - Arguments to delete one Clothes.
     * @example
     * // Delete one Clothes
     * const Clothes = await prisma.clothes.delete({
     *   where: {
     *     // ... filter to delete one Clothes
     *   }
     * })
     * 
     */
    delete<T extends ClothesDeleteArgs>(args: SelectSubset<T, ClothesDeleteArgs<ExtArgs>>): Prisma__ClothesClient<$Result.GetResult<Prisma.$ClothesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Clothes.
     * @param {ClothesUpdateArgs} args - Arguments to update one Clothes.
     * @example
     * // Update one Clothes
     * const clothes = await prisma.clothes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClothesUpdateArgs>(args: SelectSubset<T, ClothesUpdateArgs<ExtArgs>>): Prisma__ClothesClient<$Result.GetResult<Prisma.$ClothesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clothes.
     * @param {ClothesDeleteManyArgs} args - Arguments to filter Clothes to delete.
     * @example
     * // Delete a few Clothes
     * const { count } = await prisma.clothes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClothesDeleteManyArgs>(args?: SelectSubset<T, ClothesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clothes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clothes
     * const clothes = await prisma.clothes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClothesUpdateManyArgs>(args: SelectSubset<T, ClothesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Clothes.
     * @param {ClothesUpsertArgs} args - Arguments to update or create a Clothes.
     * @example
     * // Update or create a Clothes
     * const clothes = await prisma.clothes.upsert({
     *   create: {
     *     // ... data to create a Clothes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Clothes we want to update
     *   }
     * })
     */
    upsert<T extends ClothesUpsertArgs>(args: SelectSubset<T, ClothesUpsertArgs<ExtArgs>>): Prisma__ClothesClient<$Result.GetResult<Prisma.$ClothesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clothes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothesCountArgs} args - Arguments to filter Clothes to count.
     * @example
     * // Count the number of Clothes
     * const count = await prisma.clothes.count({
     *   where: {
     *     // ... the filter for the Clothes we want to count
     *   }
     * })
    **/
    count<T extends ClothesCountArgs>(
      args?: Subset<T, ClothesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClothesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Clothes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClothesAggregateArgs>(args: Subset<T, ClothesAggregateArgs>): Prisma.PrismaPromise<GetClothesAggregateType<T>>

    /**
     * Group by Clothes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClothesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClothesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClothesGroupByArgs['orderBy'] }
        : { orderBy?: ClothesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClothesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClothesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Clothes model
   */
  readonly fields: ClothesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Clothes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClothesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cartItems<T extends Clothes$cartItemsArgs<ExtArgs> = {}>(args?: Subset<T, Clothes$cartItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CartItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    mainImg<T extends Clothes$mainImgArgs<ExtArgs> = {}>(args?: Subset<T, Clothes$mainImgArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    Category<T extends Clothes$CategoryArgs<ExtArgs> = {}>(args?: Subset<T, Clothes$CategoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    comments<T extends Clothes$commentsArgs<ExtArgs> = {}>(args?: Subset<T, Clothes$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Clothes model
   */
  interface ClothesFieldRefs {
    readonly id: FieldRef<"Clothes", 'Int'>
    readonly name: FieldRef<"Clothes", 'String'>
    readonly description: FieldRef<"Clothes", 'String'>
    readonly price: FieldRef<"Clothes", 'Float'>
    readonly count: FieldRef<"Clothes", 'Int'>
    readonly Color: FieldRef<"Clothes", 'String'>
    readonly mainImgId: FieldRef<"Clothes", 'Int'>
    readonly createdAt: FieldRef<"Clothes", 'DateTime'>
    readonly updatedAt: FieldRef<"Clothes", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Clothes findUnique
   */
  export type ClothesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clothes
     */
    select?: ClothesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clothes
     */
    omit?: ClothesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothesInclude<ExtArgs> | null
    /**
     * Filter, which Clothes to fetch.
     */
    where: ClothesWhereUniqueInput
  }

  /**
   * Clothes findUniqueOrThrow
   */
  export type ClothesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clothes
     */
    select?: ClothesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clothes
     */
    omit?: ClothesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothesInclude<ExtArgs> | null
    /**
     * Filter, which Clothes to fetch.
     */
    where: ClothesWhereUniqueInput
  }

  /**
   * Clothes findFirst
   */
  export type ClothesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clothes
     */
    select?: ClothesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clothes
     */
    omit?: ClothesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothesInclude<ExtArgs> | null
    /**
     * Filter, which Clothes to fetch.
     */
    where?: ClothesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clothes to fetch.
     */
    orderBy?: ClothesOrderByWithRelationInput | ClothesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clothes.
     */
    cursor?: ClothesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clothes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clothes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clothes.
     */
    distinct?: ClothesScalarFieldEnum | ClothesScalarFieldEnum[]
  }

  /**
   * Clothes findFirstOrThrow
   */
  export type ClothesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clothes
     */
    select?: ClothesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clothes
     */
    omit?: ClothesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothesInclude<ExtArgs> | null
    /**
     * Filter, which Clothes to fetch.
     */
    where?: ClothesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clothes to fetch.
     */
    orderBy?: ClothesOrderByWithRelationInput | ClothesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clothes.
     */
    cursor?: ClothesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clothes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clothes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clothes.
     */
    distinct?: ClothesScalarFieldEnum | ClothesScalarFieldEnum[]
  }

  /**
   * Clothes findMany
   */
  export type ClothesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clothes
     */
    select?: ClothesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clothes
     */
    omit?: ClothesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothesInclude<ExtArgs> | null
    /**
     * Filter, which Clothes to fetch.
     */
    where?: ClothesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clothes to fetch.
     */
    orderBy?: ClothesOrderByWithRelationInput | ClothesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clothes.
     */
    cursor?: ClothesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clothes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clothes.
     */
    skip?: number
    distinct?: ClothesScalarFieldEnum | ClothesScalarFieldEnum[]
  }

  /**
   * Clothes create
   */
  export type ClothesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clothes
     */
    select?: ClothesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clothes
     */
    omit?: ClothesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothesInclude<ExtArgs> | null
    /**
     * The data needed to create a Clothes.
     */
    data: XOR<ClothesCreateInput, ClothesUncheckedCreateInput>
  }

  /**
   * Clothes createMany
   */
  export type ClothesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clothes.
     */
    data: ClothesCreateManyInput | ClothesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Clothes update
   */
  export type ClothesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clothes
     */
    select?: ClothesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clothes
     */
    omit?: ClothesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothesInclude<ExtArgs> | null
    /**
     * The data needed to update a Clothes.
     */
    data: XOR<ClothesUpdateInput, ClothesUncheckedUpdateInput>
    /**
     * Choose, which Clothes to update.
     */
    where: ClothesWhereUniqueInput
  }

  /**
   * Clothes updateMany
   */
  export type ClothesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clothes.
     */
    data: XOR<ClothesUpdateManyMutationInput, ClothesUncheckedUpdateManyInput>
    /**
     * Filter which Clothes to update
     */
    where?: ClothesWhereInput
    /**
     * Limit how many Clothes to update.
     */
    limit?: number
  }

  /**
   * Clothes upsert
   */
  export type ClothesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clothes
     */
    select?: ClothesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clothes
     */
    omit?: ClothesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothesInclude<ExtArgs> | null
    /**
     * The filter to search for the Clothes to update in case it exists.
     */
    where: ClothesWhereUniqueInput
    /**
     * In case the Clothes found by the `where` argument doesn't exist, create a new Clothes with this data.
     */
    create: XOR<ClothesCreateInput, ClothesUncheckedCreateInput>
    /**
     * In case the Clothes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClothesUpdateInput, ClothesUncheckedUpdateInput>
  }

  /**
   * Clothes delete
   */
  export type ClothesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clothes
     */
    select?: ClothesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clothes
     */
    omit?: ClothesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothesInclude<ExtArgs> | null
    /**
     * Filter which Clothes to delete.
     */
    where: ClothesWhereUniqueInput
  }

  /**
   * Clothes deleteMany
   */
  export type ClothesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clothes to delete
     */
    where?: ClothesWhereInput
    /**
     * Limit how many Clothes to delete.
     */
    limit?: number
  }

  /**
   * Clothes.cartItems
   */
  export type Clothes$cartItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CartItem
     */
    select?: CartItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CartItem
     */
    omit?: CartItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CartItemInclude<ExtArgs> | null
    where?: CartItemWhereInput
    orderBy?: CartItemOrderByWithRelationInput | CartItemOrderByWithRelationInput[]
    cursor?: CartItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CartItemScalarFieldEnum | CartItemScalarFieldEnum[]
  }

  /**
   * Clothes.mainImg
   */
  export type Clothes$mainImgArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    where?: ImageWhereInput
  }

  /**
   * Clothes.Category
   */
  export type Clothes$CategoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    cursor?: CategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Clothes.comments
   */
  export type Clothes$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Clothes without action
   */
  export type ClothesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clothes
     */
    select?: ClothesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clothes
     */
    omit?: ClothesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothesInclude<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    id: number | null
    Clothes_id: number | null
  }

  export type CategorySumAggregateOutputType = {
    id: number | null
    Clothes_id: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: number | null
    Clothes_id: number | null
    name: string | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: number | null
    Clothes_id: number | null
    name: string | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    Clothes_id: number
    name: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    id?: true
    Clothes_id?: true
  }

  export type CategorySumAggregateInputType = {
    id?: true
    Clothes_id?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    Clothes_id?: true
    name?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    Clothes_id?: true
    name?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    Clothes_id?: true
    name?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: number
    Clothes_id: number
    name: string
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    Clothes_id?: boolean
    name?: boolean
    Clothes?: boolean | ClothesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>



  export type CategorySelectScalar = {
    id?: boolean
    Clothes_id?: boolean
    name?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "Clothes_id" | "name", ExtArgs["result"]["category"]>
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Clothes?: boolean | ClothesDefaultArgs<ExtArgs>
  }

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      Clothes: Prisma.$ClothesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      Clothes_id: number
      name: string
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Clothes<T extends ClothesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClothesDefaultArgs<ExtArgs>>): Prisma__ClothesClient<$Result.GetResult<Prisma.$ClothesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'Int'>
    readonly Clothes_id: FieldRef<"Category", 'Int'>
    readonly name: FieldRef<"Category", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Image
   */

  export type AggregateImage = {
    _count: ImageCountAggregateOutputType | null
    _avg: ImageAvgAggregateOutputType | null
    _sum: ImageSumAggregateOutputType | null
    _min: ImageMinAggregateOutputType | null
    _max: ImageMaxAggregateOutputType | null
  }

  export type ImageAvgAggregateOutputType = {
    id: number | null
  }

  export type ImageSumAggregateOutputType = {
    id: number | null
  }

  export type ImageMinAggregateOutputType = {
    id: number | null
    name: string | null
    url: string | null
  }

  export type ImageMaxAggregateOutputType = {
    id: number | null
    name: string | null
    url: string | null
  }

  export type ImageCountAggregateOutputType = {
    id: number
    name: number
    url: number
    _all: number
  }


  export type ImageAvgAggregateInputType = {
    id?: true
  }

  export type ImageSumAggregateInputType = {
    id?: true
  }

  export type ImageMinAggregateInputType = {
    id?: true
    name?: true
    url?: true
  }

  export type ImageMaxAggregateInputType = {
    id?: true
    name?: true
    url?: true
  }

  export type ImageCountAggregateInputType = {
    id?: true
    name?: true
    url?: true
    _all?: true
  }

  export type ImageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Image to aggregate.
     */
    where?: ImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Images to fetch.
     */
    orderBy?: ImageOrderByWithRelationInput | ImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Images
    **/
    _count?: true | ImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImageMaxAggregateInputType
  }

  export type GetImageAggregateType<T extends ImageAggregateArgs> = {
        [P in keyof T & keyof AggregateImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImage[P]>
      : GetScalarType<T[P], AggregateImage[P]>
  }




  export type ImageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImageWhereInput
    orderBy?: ImageOrderByWithAggregationInput | ImageOrderByWithAggregationInput[]
    by: ImageScalarFieldEnum[] | ImageScalarFieldEnum
    having?: ImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImageCountAggregateInputType | true
    _avg?: ImageAvgAggregateInputType
    _sum?: ImageSumAggregateInputType
    _min?: ImageMinAggregateInputType
    _max?: ImageMaxAggregateInputType
  }

  export type ImageGroupByOutputType = {
    id: number
    name: string
    url: string
    _count: ImageCountAggregateOutputType | null
    _avg: ImageAvgAggregateOutputType | null
    _sum: ImageSumAggregateOutputType | null
    _min: ImageMinAggregateOutputType | null
    _max: ImageMaxAggregateOutputType | null
  }

  type GetImageGroupByPayload<T extends ImageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImageGroupByOutputType[P]>
            : GetScalarType<T[P], ImageGroupByOutputType[P]>
        }
      >
    >


  export type ImageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    clothesMain?: boolean | Image$clothesMainArgs<ExtArgs>
  }, ExtArgs["result"]["image"]>



  export type ImageSelectScalar = {
    id?: boolean
    name?: boolean
    url?: boolean
  }

  export type ImageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "url", ExtArgs["result"]["image"]>
  export type ImageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clothesMain?: boolean | Image$clothesMainArgs<ExtArgs>
  }

  export type $ImagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Image"
    objects: {
      clothesMain: Prisma.$ClothesPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      url: string
    }, ExtArgs["result"]["image"]>
    composites: {}
  }

  type ImageGetPayload<S extends boolean | null | undefined | ImageDefaultArgs> = $Result.GetResult<Prisma.$ImagePayload, S>

  type ImageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImageCountAggregateInputType | true
    }

  export interface ImageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Image'], meta: { name: 'Image' } }
    /**
     * Find zero or one Image that matches the filter.
     * @param {ImageFindUniqueArgs} args - Arguments to find a Image
     * @example
     * // Get one Image
     * const image = await prisma.image.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImageFindUniqueArgs>(args: SelectSubset<T, ImageFindUniqueArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Image that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImageFindUniqueOrThrowArgs} args - Arguments to find a Image
     * @example
     * // Get one Image
     * const image = await prisma.image.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImageFindUniqueOrThrowArgs>(args: SelectSubset<T, ImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Image that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageFindFirstArgs} args - Arguments to find a Image
     * @example
     * // Get one Image
     * const image = await prisma.image.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImageFindFirstArgs>(args?: SelectSubset<T, ImageFindFirstArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Image that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageFindFirstOrThrowArgs} args - Arguments to find a Image
     * @example
     * // Get one Image
     * const image = await prisma.image.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImageFindFirstOrThrowArgs>(args?: SelectSubset<T, ImageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Images that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Images
     * const images = await prisma.image.findMany()
     * 
     * // Get first 10 Images
     * const images = await prisma.image.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const imageWithIdOnly = await prisma.image.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImageFindManyArgs>(args?: SelectSubset<T, ImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Image.
     * @param {ImageCreateArgs} args - Arguments to create a Image.
     * @example
     * // Create one Image
     * const Image = await prisma.image.create({
     *   data: {
     *     // ... data to create a Image
     *   }
     * })
     * 
     */
    create<T extends ImageCreateArgs>(args: SelectSubset<T, ImageCreateArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Images.
     * @param {ImageCreateManyArgs} args - Arguments to create many Images.
     * @example
     * // Create many Images
     * const image = await prisma.image.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImageCreateManyArgs>(args?: SelectSubset<T, ImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Image.
     * @param {ImageDeleteArgs} args - Arguments to delete one Image.
     * @example
     * // Delete one Image
     * const Image = await prisma.image.delete({
     *   where: {
     *     // ... filter to delete one Image
     *   }
     * })
     * 
     */
    delete<T extends ImageDeleteArgs>(args: SelectSubset<T, ImageDeleteArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Image.
     * @param {ImageUpdateArgs} args - Arguments to update one Image.
     * @example
     * // Update one Image
     * const image = await prisma.image.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImageUpdateArgs>(args: SelectSubset<T, ImageUpdateArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Images.
     * @param {ImageDeleteManyArgs} args - Arguments to filter Images to delete.
     * @example
     * // Delete a few Images
     * const { count } = await prisma.image.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImageDeleteManyArgs>(args?: SelectSubset<T, ImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Images.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Images
     * const image = await prisma.image.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImageUpdateManyArgs>(args: SelectSubset<T, ImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Image.
     * @param {ImageUpsertArgs} args - Arguments to update or create a Image.
     * @example
     * // Update or create a Image
     * const image = await prisma.image.upsert({
     *   create: {
     *     // ... data to create a Image
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Image we want to update
     *   }
     * })
     */
    upsert<T extends ImageUpsertArgs>(args: SelectSubset<T, ImageUpsertArgs<ExtArgs>>): Prisma__ImageClient<$Result.GetResult<Prisma.$ImagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Images.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageCountArgs} args - Arguments to filter Images to count.
     * @example
     * // Count the number of Images
     * const count = await prisma.image.count({
     *   where: {
     *     // ... the filter for the Images we want to count
     *   }
     * })
    **/
    count<T extends ImageCountArgs>(
      args?: Subset<T, ImageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Image.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ImageAggregateArgs>(args: Subset<T, ImageAggregateArgs>): Prisma.PrismaPromise<GetImageAggregateType<T>>

    /**
     * Group by Image.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ImageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImageGroupByArgs['orderBy'] }
        : { orderBy?: ImageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Image model
   */
  readonly fields: ImageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Image.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clothesMain<T extends Image$clothesMainArgs<ExtArgs> = {}>(args?: Subset<T, Image$clothesMainArgs<ExtArgs>>): Prisma__ClothesClient<$Result.GetResult<Prisma.$ClothesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Image model
   */
  interface ImageFieldRefs {
    readonly id: FieldRef<"Image", 'Int'>
    readonly name: FieldRef<"Image", 'String'>
    readonly url: FieldRef<"Image", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Image findUnique
   */
  export type ImageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Image to fetch.
     */
    where: ImageWhereUniqueInput
  }

  /**
   * Image findUniqueOrThrow
   */
  export type ImageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Image to fetch.
     */
    where: ImageWhereUniqueInput
  }

  /**
   * Image findFirst
   */
  export type ImageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Image to fetch.
     */
    where?: ImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Images to fetch.
     */
    orderBy?: ImageOrderByWithRelationInput | ImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Images.
     */
    cursor?: ImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Images.
     */
    distinct?: ImageScalarFieldEnum | ImageScalarFieldEnum[]
  }

  /**
   * Image findFirstOrThrow
   */
  export type ImageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Image to fetch.
     */
    where?: ImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Images to fetch.
     */
    orderBy?: ImageOrderByWithRelationInput | ImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Images.
     */
    cursor?: ImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Images.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Images.
     */
    distinct?: ImageScalarFieldEnum | ImageScalarFieldEnum[]
  }

  /**
   * Image findMany
   */
  export type ImageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter, which Images to fetch.
     */
    where?: ImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Images to fetch.
     */
    orderBy?: ImageOrderByWithRelationInput | ImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Images.
     */
    cursor?: ImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Images from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Images.
     */
    skip?: number
    distinct?: ImageScalarFieldEnum | ImageScalarFieldEnum[]
  }

  /**
   * Image create
   */
  export type ImageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * The data needed to create a Image.
     */
    data: XOR<ImageCreateInput, ImageUncheckedCreateInput>
  }

  /**
   * Image createMany
   */
  export type ImageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Images.
     */
    data: ImageCreateManyInput | ImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Image update
   */
  export type ImageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * The data needed to update a Image.
     */
    data: XOR<ImageUpdateInput, ImageUncheckedUpdateInput>
    /**
     * Choose, which Image to update.
     */
    where: ImageWhereUniqueInput
  }

  /**
   * Image updateMany
   */
  export type ImageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Images.
     */
    data: XOR<ImageUpdateManyMutationInput, ImageUncheckedUpdateManyInput>
    /**
     * Filter which Images to update
     */
    where?: ImageWhereInput
    /**
     * Limit how many Images to update.
     */
    limit?: number
  }

  /**
   * Image upsert
   */
  export type ImageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * The filter to search for the Image to update in case it exists.
     */
    where: ImageWhereUniqueInput
    /**
     * In case the Image found by the `where` argument doesn't exist, create a new Image with this data.
     */
    create: XOR<ImageCreateInput, ImageUncheckedCreateInput>
    /**
     * In case the Image was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImageUpdateInput, ImageUncheckedUpdateInput>
  }

  /**
   * Image delete
   */
  export type ImageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
    /**
     * Filter which Image to delete.
     */
    where: ImageWhereUniqueInput
  }

  /**
   * Image deleteMany
   */
  export type ImageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Images to delete
     */
    where?: ImageWhereInput
    /**
     * Limit how many Images to delete.
     */
    limit?: number
  }

  /**
   * Image.clothesMain
   */
  export type Image$clothesMainArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clothes
     */
    select?: ClothesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clothes
     */
    omit?: ClothesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClothesInclude<ExtArgs> | null
    where?: ClothesWhereInput
  }

  /**
   * Image without action
   */
  export type ImageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Image
     */
    omit?: ImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImageInclude<ExtArgs> | null
  }


  /**
   * Model Comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null
    _avg: CommentAvgAggregateOutputType | null
    _sum: CommentSumAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  export type CommentAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    clothesId: number | null
    point: number | null
  }

  export type CommentSumAggregateOutputType = {
    id: number | null
    userId: number | null
    clothesId: number | null
    point: number | null
  }

  export type CommentMinAggregateOutputType = {
    id: number | null
    userId: number | null
    clothesId: number | null
    content: string | null
    point: number | null
  }

  export type CommentMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    clothesId: number | null
    content: string | null
    point: number | null
  }

  export type CommentCountAggregateOutputType = {
    id: number
    userId: number
    clothesId: number
    content: number
    point: number
    _all: number
  }


  export type CommentAvgAggregateInputType = {
    id?: true
    userId?: true
    clothesId?: true
    point?: true
  }

  export type CommentSumAggregateInputType = {
    id?: true
    userId?: true
    clothesId?: true
    point?: true
  }

  export type CommentMinAggregateInputType = {
    id?: true
    userId?: true
    clothesId?: true
    content?: true
    point?: true
  }

  export type CommentMaxAggregateInputType = {
    id?: true
    userId?: true
    clothesId?: true
    content?: true
    point?: true
  }

  export type CommentCountAggregateInputType = {
    id?: true
    userId?: true
    clothesId?: true
    content?: true
    point?: true
    _all?: true
  }

  export type CommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comment to aggregate.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Comments
    **/
    _count?: true | CommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CommentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CommentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommentMaxAggregateInputType
  }

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
        [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>
  }




  export type CommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithAggregationInput | CommentOrderByWithAggregationInput[]
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum
    having?: CommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommentCountAggregateInputType | true
    _avg?: CommentAvgAggregateInputType
    _sum?: CommentSumAggregateInputType
    _min?: CommentMinAggregateInputType
    _max?: CommentMaxAggregateInputType
  }

  export type CommentGroupByOutputType = {
    id: number
    userId: number
    clothesId: number
    content: string
    point: number
    _count: CommentCountAggregateOutputType | null
    _avg: CommentAvgAggregateOutputType | null
    _sum: CommentSumAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommentGroupByOutputType[P]>
        }
      >
    >


  export type CommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    clothesId?: boolean
    content?: boolean
    point?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    clothes?: boolean | ClothesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>



  export type CommentSelectScalar = {
    id?: boolean
    userId?: boolean
    clothesId?: boolean
    content?: boolean
    point?: boolean
  }

  export type CommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "clothesId" | "content" | "point", ExtArgs["result"]["comment"]>
  export type CommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    clothes?: boolean | ClothesDefaultArgs<ExtArgs>
  }

  export type $CommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Comment"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      clothes: Prisma.$ClothesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      clothesId: number
      content: string
      point: number
    }, ExtArgs["result"]["comment"]>
    composites: {}
  }

  type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = $Result.GetResult<Prisma.$CommentPayload, S>

  type CommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CommentCountAggregateInputType | true
    }

  export interface CommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Comment'], meta: { name: 'Comment' } }
    /**
     * Find zero or one Comment that matches the filter.
     * @param {CommentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommentFindUniqueArgs>(args: SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CommentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommentFindFirstArgs>(args?: SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     * 
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommentFindManyArgs>(args?: SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Comment.
     * @param {CommentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     * 
     */
    create<T extends CommentCreateArgs>(args: SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Comments.
     * @param {CommentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommentCreateManyArgs>(args?: SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Comment.
     * @param {CommentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     * 
     */
    delete<T extends CommentDeleteArgs>(args: SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Comment.
     * @param {CommentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommentUpdateArgs>(args: SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Comments.
     * @param {CommentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommentDeleteManyArgs>(args?: SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommentUpdateManyArgs>(args: SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Comment.
     * @param {CommentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends CommentUpsertArgs>(args: SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
    **/
    count<T extends CommentCountArgs>(
      args?: Subset<T, CommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommentAggregateArgs>(args: Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommentGroupByArgs['orderBy'] }
        : { orderBy?: CommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Comment model
   */
  readonly fields: CommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    clothes<T extends ClothesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClothesDefaultArgs<ExtArgs>>): Prisma__ClothesClient<$Result.GetResult<Prisma.$ClothesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Comment model
   */
  interface CommentFieldRefs {
    readonly id: FieldRef<"Comment", 'Int'>
    readonly userId: FieldRef<"Comment", 'Int'>
    readonly clothesId: FieldRef<"Comment", 'Int'>
    readonly content: FieldRef<"Comment", 'String'>
    readonly point: FieldRef<"Comment", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Comment findUnique
   */
  export type CommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findUniqueOrThrow
   */
  export type CommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findFirst
   */
  export type CommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findFirstOrThrow
   */
  export type CommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findMany
   */
  export type CommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comments to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment create
   */
  export type CommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to create a Comment.
     */
    data: XOR<CommentCreateInput, CommentUncheckedCreateInput>
  }

  /**
   * Comment createMany
   */
  export type CommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Comment update
   */
  export type CommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to update a Comment.
     */
    data: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
    /**
     * Choose, which Comment to update.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment updateMany
   */
  export type CommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to update.
     */
    limit?: number
  }

  /**
   * Comment upsert
   */
  export type CommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The filter to search for the Comment to update in case it exists.
     */
    where: CommentWhereUniqueInput
    /**
     * In case the Comment found by the `where` argument doesn't exist, create a new Comment with this data.
     */
    create: XOR<CommentCreateInput, CommentUncheckedCreateInput>
    /**
     * In case the Comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
  }

  /**
   * Comment delete
   */
  export type CommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter which Comment to delete.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment deleteMany
   */
  export type CommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comments to delete
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to delete.
     */
    limit?: number
  }

  /**
   * Comment without action
   */
  export type CommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
  }


  /**
   * Model Coupon
   */

  export type AggregateCoupon = {
    _count: CouponCountAggregateOutputType | null
    _avg: CouponAvgAggregateOutputType | null
    _sum: CouponSumAggregateOutputType | null
    _min: CouponMinAggregateOutputType | null
    _max: CouponMaxAggregateOutputType | null
  }

  export type CouponAvgAggregateOutputType = {
    id: number | null
    discount: number | null
    count: number | null
  }

  export type CouponSumAggregateOutputType = {
    id: number | null
    discount: number | null
    count: number | null
  }

  export type CouponMinAggregateOutputType = {
    id: number | null
    code: string | null
    discount: number | null
    startDate: Date | null
    endDate: Date | null
    isActive: boolean | null
    count: number | null
  }

  export type CouponMaxAggregateOutputType = {
    id: number | null
    code: string | null
    discount: number | null
    startDate: Date | null
    endDate: Date | null
    isActive: boolean | null
    count: number | null
  }

  export type CouponCountAggregateOutputType = {
    id: number
    code: number
    discount: number
    startDate: number
    endDate: number
    isActive: number
    count: number
    _all: number
  }


  export type CouponAvgAggregateInputType = {
    id?: true
    discount?: true
    count?: true
  }

  export type CouponSumAggregateInputType = {
    id?: true
    discount?: true
    count?: true
  }

  export type CouponMinAggregateInputType = {
    id?: true
    code?: true
    discount?: true
    startDate?: true
    endDate?: true
    isActive?: true
    count?: true
  }

  export type CouponMaxAggregateInputType = {
    id?: true
    code?: true
    discount?: true
    startDate?: true
    endDate?: true
    isActive?: true
    count?: true
  }

  export type CouponCountAggregateInputType = {
    id?: true
    code?: true
    discount?: true
    startDate?: true
    endDate?: true
    isActive?: true
    count?: true
    _all?: true
  }

  export type CouponAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Coupon to aggregate.
     */
    where?: CouponWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coupons to fetch.
     */
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CouponWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coupons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coupons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Coupons
    **/
    _count?: true | CouponCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CouponAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CouponSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CouponMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CouponMaxAggregateInputType
  }

  export type GetCouponAggregateType<T extends CouponAggregateArgs> = {
        [P in keyof T & keyof AggregateCoupon]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCoupon[P]>
      : GetScalarType<T[P], AggregateCoupon[P]>
  }




  export type CouponGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CouponWhereInput
    orderBy?: CouponOrderByWithAggregationInput | CouponOrderByWithAggregationInput[]
    by: CouponScalarFieldEnum[] | CouponScalarFieldEnum
    having?: CouponScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CouponCountAggregateInputType | true
    _avg?: CouponAvgAggregateInputType
    _sum?: CouponSumAggregateInputType
    _min?: CouponMinAggregateInputType
    _max?: CouponMaxAggregateInputType
  }

  export type CouponGroupByOutputType = {
    id: number
    code: string
    discount: number
    startDate: Date
    endDate: Date
    isActive: boolean
    count: number
    _count: CouponCountAggregateOutputType | null
    _avg: CouponAvgAggregateOutputType | null
    _sum: CouponSumAggregateOutputType | null
    _min: CouponMinAggregateOutputType | null
    _max: CouponMaxAggregateOutputType | null
  }

  type GetCouponGroupByPayload<T extends CouponGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CouponGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CouponGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CouponGroupByOutputType[P]>
            : GetScalarType<T[P], CouponGroupByOutputType[P]>
        }
      >
    >


  export type CouponSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    discount?: boolean
    startDate?: boolean
    endDate?: boolean
    isActive?: boolean
    count?: boolean
    user?: boolean | Coupon$userArgs<ExtArgs>
    _count?: boolean | CouponCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["coupon"]>



  export type CouponSelectScalar = {
    id?: boolean
    code?: boolean
    discount?: boolean
    startDate?: boolean
    endDate?: boolean
    isActive?: boolean
    count?: boolean
  }

  export type CouponOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "discount" | "startDate" | "endDate" | "isActive" | "count", ExtArgs["result"]["coupon"]>
  export type CouponInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Coupon$userArgs<ExtArgs>
    _count?: boolean | CouponCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CouponPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Coupon"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      code: string
      discount: number
      startDate: Date
      endDate: Date
      isActive: boolean
      count: number
    }, ExtArgs["result"]["coupon"]>
    composites: {}
  }

  type CouponGetPayload<S extends boolean | null | undefined | CouponDefaultArgs> = $Result.GetResult<Prisma.$CouponPayload, S>

  type CouponCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CouponFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CouponCountAggregateInputType | true
    }

  export interface CouponDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Coupon'], meta: { name: 'Coupon' } }
    /**
     * Find zero or one Coupon that matches the filter.
     * @param {CouponFindUniqueArgs} args - Arguments to find a Coupon
     * @example
     * // Get one Coupon
     * const coupon = await prisma.coupon.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CouponFindUniqueArgs>(args: SelectSubset<T, CouponFindUniqueArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Coupon that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CouponFindUniqueOrThrowArgs} args - Arguments to find a Coupon
     * @example
     * // Get one Coupon
     * const coupon = await prisma.coupon.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CouponFindUniqueOrThrowArgs>(args: SelectSubset<T, CouponFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Coupon that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponFindFirstArgs} args - Arguments to find a Coupon
     * @example
     * // Get one Coupon
     * const coupon = await prisma.coupon.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CouponFindFirstArgs>(args?: SelectSubset<T, CouponFindFirstArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Coupon that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponFindFirstOrThrowArgs} args - Arguments to find a Coupon
     * @example
     * // Get one Coupon
     * const coupon = await prisma.coupon.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CouponFindFirstOrThrowArgs>(args?: SelectSubset<T, CouponFindFirstOrThrowArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Coupons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Coupons
     * const coupons = await prisma.coupon.findMany()
     * 
     * // Get first 10 Coupons
     * const coupons = await prisma.coupon.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const couponWithIdOnly = await prisma.coupon.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CouponFindManyArgs>(args?: SelectSubset<T, CouponFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Coupon.
     * @param {CouponCreateArgs} args - Arguments to create a Coupon.
     * @example
     * // Create one Coupon
     * const Coupon = await prisma.coupon.create({
     *   data: {
     *     // ... data to create a Coupon
     *   }
     * })
     * 
     */
    create<T extends CouponCreateArgs>(args: SelectSubset<T, CouponCreateArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Coupons.
     * @param {CouponCreateManyArgs} args - Arguments to create many Coupons.
     * @example
     * // Create many Coupons
     * const coupon = await prisma.coupon.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CouponCreateManyArgs>(args?: SelectSubset<T, CouponCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Coupon.
     * @param {CouponDeleteArgs} args - Arguments to delete one Coupon.
     * @example
     * // Delete one Coupon
     * const Coupon = await prisma.coupon.delete({
     *   where: {
     *     // ... filter to delete one Coupon
     *   }
     * })
     * 
     */
    delete<T extends CouponDeleteArgs>(args: SelectSubset<T, CouponDeleteArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Coupon.
     * @param {CouponUpdateArgs} args - Arguments to update one Coupon.
     * @example
     * // Update one Coupon
     * const coupon = await prisma.coupon.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CouponUpdateArgs>(args: SelectSubset<T, CouponUpdateArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Coupons.
     * @param {CouponDeleteManyArgs} args - Arguments to filter Coupons to delete.
     * @example
     * // Delete a few Coupons
     * const { count } = await prisma.coupon.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CouponDeleteManyArgs>(args?: SelectSubset<T, CouponDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Coupons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Coupons
     * const coupon = await prisma.coupon.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CouponUpdateManyArgs>(args: SelectSubset<T, CouponUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Coupon.
     * @param {CouponUpsertArgs} args - Arguments to update or create a Coupon.
     * @example
     * // Update or create a Coupon
     * const coupon = await prisma.coupon.upsert({
     *   create: {
     *     // ... data to create a Coupon
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Coupon we want to update
     *   }
     * })
     */
    upsert<T extends CouponUpsertArgs>(args: SelectSubset<T, CouponUpsertArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Coupons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponCountArgs} args - Arguments to filter Coupons to count.
     * @example
     * // Count the number of Coupons
     * const count = await prisma.coupon.count({
     *   where: {
     *     // ... the filter for the Coupons we want to count
     *   }
     * })
    **/
    count<T extends CouponCountArgs>(
      args?: Subset<T, CouponCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CouponCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Coupon.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CouponAggregateArgs>(args: Subset<T, CouponAggregateArgs>): Prisma.PrismaPromise<GetCouponAggregateType<T>>

    /**
     * Group by Coupon.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CouponGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CouponGroupByArgs['orderBy'] }
        : { orderBy?: CouponGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CouponGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCouponGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Coupon model
   */
  readonly fields: CouponFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Coupon.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CouponClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Coupon$userArgs<ExtArgs> = {}>(args?: Subset<T, Coupon$userArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Coupon model
   */
  interface CouponFieldRefs {
    readonly id: FieldRef<"Coupon", 'Int'>
    readonly code: FieldRef<"Coupon", 'String'>
    readonly discount: FieldRef<"Coupon", 'Float'>
    readonly startDate: FieldRef<"Coupon", 'DateTime'>
    readonly endDate: FieldRef<"Coupon", 'DateTime'>
    readonly isActive: FieldRef<"Coupon", 'Boolean'>
    readonly count: FieldRef<"Coupon", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Coupon findUnique
   */
  export type CouponFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupon to fetch.
     */
    where: CouponWhereUniqueInput
  }

  /**
   * Coupon findUniqueOrThrow
   */
  export type CouponFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupon to fetch.
     */
    where: CouponWhereUniqueInput
  }

  /**
   * Coupon findFirst
   */
  export type CouponFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupon to fetch.
     */
    where?: CouponWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coupons to fetch.
     */
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Coupons.
     */
    cursor?: CouponWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coupons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coupons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Coupons.
     */
    distinct?: CouponScalarFieldEnum | CouponScalarFieldEnum[]
  }

  /**
   * Coupon findFirstOrThrow
   */
  export type CouponFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupon to fetch.
     */
    where?: CouponWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coupons to fetch.
     */
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Coupons.
     */
    cursor?: CouponWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coupons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coupons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Coupons.
     */
    distinct?: CouponScalarFieldEnum | CouponScalarFieldEnum[]
  }

  /**
   * Coupon findMany
   */
  export type CouponFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupons to fetch.
     */
    where?: CouponWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coupons to fetch.
     */
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Coupons.
     */
    cursor?: CouponWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coupons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coupons.
     */
    skip?: number
    distinct?: CouponScalarFieldEnum | CouponScalarFieldEnum[]
  }

  /**
   * Coupon create
   */
  export type CouponCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * The data needed to create a Coupon.
     */
    data: XOR<CouponCreateInput, CouponUncheckedCreateInput>
  }

  /**
   * Coupon createMany
   */
  export type CouponCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Coupons.
     */
    data: CouponCreateManyInput | CouponCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Coupon update
   */
  export type CouponUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * The data needed to update a Coupon.
     */
    data: XOR<CouponUpdateInput, CouponUncheckedUpdateInput>
    /**
     * Choose, which Coupon to update.
     */
    where: CouponWhereUniqueInput
  }

  /**
   * Coupon updateMany
   */
  export type CouponUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Coupons.
     */
    data: XOR<CouponUpdateManyMutationInput, CouponUncheckedUpdateManyInput>
    /**
     * Filter which Coupons to update
     */
    where?: CouponWhereInput
    /**
     * Limit how many Coupons to update.
     */
    limit?: number
  }

  /**
   * Coupon upsert
   */
  export type CouponUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * The filter to search for the Coupon to update in case it exists.
     */
    where: CouponWhereUniqueInput
    /**
     * In case the Coupon found by the `where` argument doesn't exist, create a new Coupon with this data.
     */
    create: XOR<CouponCreateInput, CouponUncheckedCreateInput>
    /**
     * In case the Coupon was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CouponUpdateInput, CouponUncheckedUpdateInput>
  }

  /**
   * Coupon delete
   */
  export type CouponDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter which Coupon to delete.
     */
    where: CouponWhereUniqueInput
  }

  /**
   * Coupon deleteMany
   */
  export type CouponDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Coupons to delete
     */
    where?: CouponWhereInput
    /**
     * Limit how many Coupons to delete.
     */
    limit?: number
  }

  /**
   * Coupon.user
   */
  export type Coupon$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Coupon without action
   */
  export type CouponDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
  }


  /**
   * Model Shipping
   */

  export type AggregateShipping = {
    _count: ShippingCountAggregateOutputType | null
    _avg: ShippingAvgAggregateOutputType | null
    _sum: ShippingSumAggregateOutputType | null
    _min: ShippingMinAggregateOutputType | null
    _max: ShippingMaxAggregateOutputType | null
  }

  export type ShippingAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    transID: number | null
  }

  export type ShippingSumAggregateOutputType = {
    id: number | null
    userId: number | null
    transID: number | null
  }

  export type ShippingMinAggregateOutputType = {
    id: number | null
    userId: number | null
    address: string | null
    state: $Enums.State | null
    transID: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShippingMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    address: string | null
    state: $Enums.State | null
    transID: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShippingCountAggregateOutputType = {
    id: number
    userId: number
    address: number
    state: number
    transID: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ShippingAvgAggregateInputType = {
    id?: true
    userId?: true
    transID?: true
  }

  export type ShippingSumAggregateInputType = {
    id?: true
    userId?: true
    transID?: true
  }

  export type ShippingMinAggregateInputType = {
    id?: true
    userId?: true
    address?: true
    state?: true
    transID?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShippingMaxAggregateInputType = {
    id?: true
    userId?: true
    address?: true
    state?: true
    transID?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShippingCountAggregateInputType = {
    id?: true
    userId?: true
    address?: true
    state?: true
    transID?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ShippingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shipping to aggregate.
     */
    where?: ShippingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shippings to fetch.
     */
    orderBy?: ShippingOrderByWithRelationInput | ShippingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShippingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shippings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shippings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Shippings
    **/
    _count?: true | ShippingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ShippingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ShippingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShippingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShippingMaxAggregateInputType
  }

  export type GetShippingAggregateType<T extends ShippingAggregateArgs> = {
        [P in keyof T & keyof AggregateShipping]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShipping[P]>
      : GetScalarType<T[P], AggregateShipping[P]>
  }




  export type ShippingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShippingWhereInput
    orderBy?: ShippingOrderByWithAggregationInput | ShippingOrderByWithAggregationInput[]
    by: ShippingScalarFieldEnum[] | ShippingScalarFieldEnum
    having?: ShippingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShippingCountAggregateInputType | true
    _avg?: ShippingAvgAggregateInputType
    _sum?: ShippingSumAggregateInputType
    _min?: ShippingMinAggregateInputType
    _max?: ShippingMaxAggregateInputType
  }

  export type ShippingGroupByOutputType = {
    id: number
    userId: number
    address: string
    state: $Enums.State
    transID: number
    createdAt: Date
    updatedAt: Date
    _count: ShippingCountAggregateOutputType | null
    _avg: ShippingAvgAggregateOutputType | null
    _sum: ShippingSumAggregateOutputType | null
    _min: ShippingMinAggregateOutputType | null
    _max: ShippingMaxAggregateOutputType | null
  }

  type GetShippingGroupByPayload<T extends ShippingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShippingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShippingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShippingGroupByOutputType[P]>
            : GetScalarType<T[P], ShippingGroupByOutputType[P]>
        }
      >
    >


  export type ShippingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    address?: boolean
    state?: boolean
    transID?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    transaction?: boolean | TransactionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipping"]>



  export type ShippingSelectScalar = {
    id?: boolean
    userId?: boolean
    address?: boolean
    state?: boolean
    transID?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ShippingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "address" | "state" | "transID" | "createdAt" | "updatedAt", ExtArgs["result"]["shipping"]>
  export type ShippingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    transaction?: boolean | TransactionDefaultArgs<ExtArgs>
  }

  export type $ShippingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Shipping"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      transaction: Prisma.$TransactionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      address: string
      state: $Enums.State
      transID: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["shipping"]>
    composites: {}
  }

  type ShippingGetPayload<S extends boolean | null | undefined | ShippingDefaultArgs> = $Result.GetResult<Prisma.$ShippingPayload, S>

  type ShippingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShippingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShippingCountAggregateInputType | true
    }

  export interface ShippingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Shipping'], meta: { name: 'Shipping' } }
    /**
     * Find zero or one Shipping that matches the filter.
     * @param {ShippingFindUniqueArgs} args - Arguments to find a Shipping
     * @example
     * // Get one Shipping
     * const shipping = await prisma.shipping.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShippingFindUniqueArgs>(args: SelectSubset<T, ShippingFindUniqueArgs<ExtArgs>>): Prisma__ShippingClient<$Result.GetResult<Prisma.$ShippingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Shipping that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShippingFindUniqueOrThrowArgs} args - Arguments to find a Shipping
     * @example
     * // Get one Shipping
     * const shipping = await prisma.shipping.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShippingFindUniqueOrThrowArgs>(args: SelectSubset<T, ShippingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShippingClient<$Result.GetResult<Prisma.$ShippingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Shipping that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingFindFirstArgs} args - Arguments to find a Shipping
     * @example
     * // Get one Shipping
     * const shipping = await prisma.shipping.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShippingFindFirstArgs>(args?: SelectSubset<T, ShippingFindFirstArgs<ExtArgs>>): Prisma__ShippingClient<$Result.GetResult<Prisma.$ShippingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Shipping that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingFindFirstOrThrowArgs} args - Arguments to find a Shipping
     * @example
     * // Get one Shipping
     * const shipping = await prisma.shipping.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShippingFindFirstOrThrowArgs>(args?: SelectSubset<T, ShippingFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShippingClient<$Result.GetResult<Prisma.$ShippingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Shippings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Shippings
     * const shippings = await prisma.shipping.findMany()
     * 
     * // Get first 10 Shippings
     * const shippings = await prisma.shipping.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shippingWithIdOnly = await prisma.shipping.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShippingFindManyArgs>(args?: SelectSubset<T, ShippingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShippingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Shipping.
     * @param {ShippingCreateArgs} args - Arguments to create a Shipping.
     * @example
     * // Create one Shipping
     * const Shipping = await prisma.shipping.create({
     *   data: {
     *     // ... data to create a Shipping
     *   }
     * })
     * 
     */
    create<T extends ShippingCreateArgs>(args: SelectSubset<T, ShippingCreateArgs<ExtArgs>>): Prisma__ShippingClient<$Result.GetResult<Prisma.$ShippingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Shippings.
     * @param {ShippingCreateManyArgs} args - Arguments to create many Shippings.
     * @example
     * // Create many Shippings
     * const shipping = await prisma.shipping.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShippingCreateManyArgs>(args?: SelectSubset<T, ShippingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Shipping.
     * @param {ShippingDeleteArgs} args - Arguments to delete one Shipping.
     * @example
     * // Delete one Shipping
     * const Shipping = await prisma.shipping.delete({
     *   where: {
     *     // ... filter to delete one Shipping
     *   }
     * })
     * 
     */
    delete<T extends ShippingDeleteArgs>(args: SelectSubset<T, ShippingDeleteArgs<ExtArgs>>): Prisma__ShippingClient<$Result.GetResult<Prisma.$ShippingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Shipping.
     * @param {ShippingUpdateArgs} args - Arguments to update one Shipping.
     * @example
     * // Update one Shipping
     * const shipping = await prisma.shipping.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShippingUpdateArgs>(args: SelectSubset<T, ShippingUpdateArgs<ExtArgs>>): Prisma__ShippingClient<$Result.GetResult<Prisma.$ShippingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Shippings.
     * @param {ShippingDeleteManyArgs} args - Arguments to filter Shippings to delete.
     * @example
     * // Delete a few Shippings
     * const { count } = await prisma.shipping.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShippingDeleteManyArgs>(args?: SelectSubset<T, ShippingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Shippings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Shippings
     * const shipping = await prisma.shipping.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShippingUpdateManyArgs>(args: SelectSubset<T, ShippingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Shipping.
     * @param {ShippingUpsertArgs} args - Arguments to update or create a Shipping.
     * @example
     * // Update or create a Shipping
     * const shipping = await prisma.shipping.upsert({
     *   create: {
     *     // ... data to create a Shipping
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Shipping we want to update
     *   }
     * })
     */
    upsert<T extends ShippingUpsertArgs>(args: SelectSubset<T, ShippingUpsertArgs<ExtArgs>>): Prisma__ShippingClient<$Result.GetResult<Prisma.$ShippingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Shippings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingCountArgs} args - Arguments to filter Shippings to count.
     * @example
     * // Count the number of Shippings
     * const count = await prisma.shipping.count({
     *   where: {
     *     // ... the filter for the Shippings we want to count
     *   }
     * })
    **/
    count<T extends ShippingCountArgs>(
      args?: Subset<T, ShippingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShippingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Shipping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShippingAggregateArgs>(args: Subset<T, ShippingAggregateArgs>): Prisma.PrismaPromise<GetShippingAggregateType<T>>

    /**
     * Group by Shipping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShippingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShippingGroupByArgs['orderBy'] }
        : { orderBy?: ShippingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShippingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShippingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Shipping model
   */
  readonly fields: ShippingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Shipping.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShippingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    transaction<T extends TransactionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TransactionDefaultArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Shipping model
   */
  interface ShippingFieldRefs {
    readonly id: FieldRef<"Shipping", 'Int'>
    readonly userId: FieldRef<"Shipping", 'Int'>
    readonly address: FieldRef<"Shipping", 'String'>
    readonly state: FieldRef<"Shipping", 'State'>
    readonly transID: FieldRef<"Shipping", 'Int'>
    readonly createdAt: FieldRef<"Shipping", 'DateTime'>
    readonly updatedAt: FieldRef<"Shipping", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Shipping findUnique
   */
  export type ShippingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipping
     */
    select?: ShippingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipping
     */
    omit?: ShippingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingInclude<ExtArgs> | null
    /**
     * Filter, which Shipping to fetch.
     */
    where: ShippingWhereUniqueInput
  }

  /**
   * Shipping findUniqueOrThrow
   */
  export type ShippingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipping
     */
    select?: ShippingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipping
     */
    omit?: ShippingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingInclude<ExtArgs> | null
    /**
     * Filter, which Shipping to fetch.
     */
    where: ShippingWhereUniqueInput
  }

  /**
   * Shipping findFirst
   */
  export type ShippingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipping
     */
    select?: ShippingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipping
     */
    omit?: ShippingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingInclude<ExtArgs> | null
    /**
     * Filter, which Shipping to fetch.
     */
    where?: ShippingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shippings to fetch.
     */
    orderBy?: ShippingOrderByWithRelationInput | ShippingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shippings.
     */
    cursor?: ShippingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shippings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shippings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shippings.
     */
    distinct?: ShippingScalarFieldEnum | ShippingScalarFieldEnum[]
  }

  /**
   * Shipping findFirstOrThrow
   */
  export type ShippingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipping
     */
    select?: ShippingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipping
     */
    omit?: ShippingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingInclude<ExtArgs> | null
    /**
     * Filter, which Shipping to fetch.
     */
    where?: ShippingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shippings to fetch.
     */
    orderBy?: ShippingOrderByWithRelationInput | ShippingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shippings.
     */
    cursor?: ShippingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shippings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shippings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shippings.
     */
    distinct?: ShippingScalarFieldEnum | ShippingScalarFieldEnum[]
  }

  /**
   * Shipping findMany
   */
  export type ShippingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipping
     */
    select?: ShippingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipping
     */
    omit?: ShippingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingInclude<ExtArgs> | null
    /**
     * Filter, which Shippings to fetch.
     */
    where?: ShippingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shippings to fetch.
     */
    orderBy?: ShippingOrderByWithRelationInput | ShippingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Shippings.
     */
    cursor?: ShippingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shippings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shippings.
     */
    skip?: number
    distinct?: ShippingScalarFieldEnum | ShippingScalarFieldEnum[]
  }

  /**
   * Shipping create
   */
  export type ShippingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipping
     */
    select?: ShippingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipping
     */
    omit?: ShippingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingInclude<ExtArgs> | null
    /**
     * The data needed to create a Shipping.
     */
    data: XOR<ShippingCreateInput, ShippingUncheckedCreateInput>
  }

  /**
   * Shipping createMany
   */
  export type ShippingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Shippings.
     */
    data: ShippingCreateManyInput | ShippingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Shipping update
   */
  export type ShippingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipping
     */
    select?: ShippingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipping
     */
    omit?: ShippingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingInclude<ExtArgs> | null
    /**
     * The data needed to update a Shipping.
     */
    data: XOR<ShippingUpdateInput, ShippingUncheckedUpdateInput>
    /**
     * Choose, which Shipping to update.
     */
    where: ShippingWhereUniqueInput
  }

  /**
   * Shipping updateMany
   */
  export type ShippingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Shippings.
     */
    data: XOR<ShippingUpdateManyMutationInput, ShippingUncheckedUpdateManyInput>
    /**
     * Filter which Shippings to update
     */
    where?: ShippingWhereInput
    /**
     * Limit how many Shippings to update.
     */
    limit?: number
  }

  /**
   * Shipping upsert
   */
  export type ShippingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipping
     */
    select?: ShippingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipping
     */
    omit?: ShippingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingInclude<ExtArgs> | null
    /**
     * The filter to search for the Shipping to update in case it exists.
     */
    where: ShippingWhereUniqueInput
    /**
     * In case the Shipping found by the `where` argument doesn't exist, create a new Shipping with this data.
     */
    create: XOR<ShippingCreateInput, ShippingUncheckedCreateInput>
    /**
     * In case the Shipping was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShippingUpdateInput, ShippingUncheckedUpdateInput>
  }

  /**
   * Shipping delete
   */
  export type ShippingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipping
     */
    select?: ShippingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipping
     */
    omit?: ShippingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingInclude<ExtArgs> | null
    /**
     * Filter which Shipping to delete.
     */
    where: ShippingWhereUniqueInput
  }

  /**
   * Shipping deleteMany
   */
  export type ShippingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shippings to delete
     */
    where?: ShippingWhereInput
    /**
     * Limit how many Shippings to delete.
     */
    limit?: number
  }

  /**
   * Shipping without action
   */
  export type ShippingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipping
     */
    select?: ShippingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipping
     */
    omit?: ShippingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    totalprice: number | null
    PaymentId: number | null
  }

  export type TransactionSumAggregateOutputType = {
    id: number | null
    userId: number | null
    totalprice: number | null
    PaymentId: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: number | null
    userId: number | null
    totalprice: number | null
    PaymentId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    totalprice: number | null
    PaymentId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    userId: number
    totalprice: number
    PaymentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    id?: true
    userId?: true
    totalprice?: true
    PaymentId?: true
  }

  export type TransactionSumAggregateInputType = {
    id?: true
    userId?: true
    totalprice?: true
    PaymentId?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    userId?: true
    totalprice?: true
    PaymentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    userId?: true
    totalprice?: true
    PaymentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    userId?: true
    totalprice?: true
    PaymentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: number
    userId: number
    totalprice: number
    PaymentId: number
    createdAt: Date
    updatedAt: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    totalprice?: boolean
    PaymentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    payment?: boolean | PaymentDefaultArgs<ExtArgs>
    Shipping?: boolean | Transaction$ShippingArgs<ExtArgs>
    Report?: boolean | Transaction$ReportArgs<ExtArgs>
    _count?: boolean | TransactionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>



  export type TransactionSelectScalar = {
    id?: boolean
    userId?: boolean
    totalprice?: boolean
    PaymentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "totalprice" | "PaymentId" | "createdAt" | "updatedAt", ExtArgs["result"]["transaction"]>
  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    payment?: boolean | PaymentDefaultArgs<ExtArgs>
    Shipping?: boolean | Transaction$ShippingArgs<ExtArgs>
    Report?: boolean | Transaction$ReportArgs<ExtArgs>
    _count?: boolean | TransactionCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      payment: Prisma.$PaymentPayload<ExtArgs>
      Shipping: Prisma.$ShippingPayload<ExtArgs>[]
      Report: Prisma.$ReportPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      totalprice: number
      PaymentId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    payment<T extends PaymentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PaymentDefaultArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Shipping<T extends Transaction$ShippingArgs<ExtArgs> = {}>(args?: Subset<T, Transaction$ShippingArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShippingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Report<T extends Transaction$ReportArgs<ExtArgs> = {}>(args?: Subset<T, Transaction$ReportArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'Int'>
    readonly userId: FieldRef<"Transaction", 'Int'>
    readonly totalprice: FieldRef<"Transaction", 'Float'>
    readonly PaymentId: FieldRef<"Transaction", 'Int'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
    readonly updatedAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction.Shipping
   */
  export type Transaction$ShippingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipping
     */
    select?: ShippingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipping
     */
    omit?: ShippingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShippingInclude<ExtArgs> | null
    where?: ShippingWhereInput
    orderBy?: ShippingOrderByWithRelationInput | ShippingOrderByWithRelationInput[]
    cursor?: ShippingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShippingScalarFieldEnum | ShippingScalarFieldEnum[]
  }

  /**
   * Transaction.Report
   */
  export type Transaction$ReportArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    where?: ReportWhereInput
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    cursor?: ReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    id: number | null
    fee: number | null
  }

  export type PaymentSumAggregateOutputType = {
    id: number | null
    fee: number | null
  }

  export type PaymentMinAggregateOutputType = {
    id: number | null
    fee: number | null
    method: string | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: number | null
    fee: number | null
    method: string | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    fee: number
    method: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    id?: true
    fee?: true
  }

  export type PaymentSumAggregateInputType = {
    id?: true
    fee?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    fee?: true
    method?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    fee?: true
    method?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    fee?: true
    method?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: number
    fee: number
    method: string
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fee?: boolean
    method?: boolean
    Transaction?: boolean | Payment$TransactionArgs<ExtArgs>
    _count?: boolean | PaymentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>



  export type PaymentSelectScalar = {
    id?: boolean
    fee?: boolean
    method?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fee" | "method", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Transaction?: boolean | Payment$TransactionArgs<ExtArgs>
    _count?: boolean | PaymentCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      Transaction: Prisma.$TransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      fee: number
      method: string
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Transaction<T extends Payment$TransactionArgs<ExtArgs> = {}>(args?: Subset<T, Payment$TransactionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'Int'>
    readonly fee: FieldRef<"Payment", 'Float'>
    readonly method: FieldRef<"Payment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment.Transaction
   */
  export type Payment$TransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model Report
   */

  export type AggregateReport = {
    _count: ReportCountAggregateOutputType | null
    _avg: ReportAvgAggregateOutputType | null
    _sum: ReportSumAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  export type ReportAvgAggregateOutputType = {
    revenue: number | null
    fee: number | null
    transactionsId: number | null
  }

  export type ReportSumAggregateOutputType = {
    revenue: number | null
    fee: number | null
    transactionsId: number | null
  }

  export type ReportMinAggregateOutputType = {
    createdAt: Date | null
    revenue: number | null
    fee: number | null
    transactionsId: number | null
  }

  export type ReportMaxAggregateOutputType = {
    createdAt: Date | null
    revenue: number | null
    fee: number | null
    transactionsId: number | null
  }

  export type ReportCountAggregateOutputType = {
    createdAt: number
    revenue: number
    fee: number
    transactionsId: number
    _all: number
  }


  export type ReportAvgAggregateInputType = {
    revenue?: true
    fee?: true
    transactionsId?: true
  }

  export type ReportSumAggregateInputType = {
    revenue?: true
    fee?: true
    transactionsId?: true
  }

  export type ReportMinAggregateInputType = {
    createdAt?: true
    revenue?: true
    fee?: true
    transactionsId?: true
  }

  export type ReportMaxAggregateInputType = {
    createdAt?: true
    revenue?: true
    fee?: true
    transactionsId?: true
  }

  export type ReportCountAggregateInputType = {
    createdAt?: true
    revenue?: true
    fee?: true
    transactionsId?: true
    _all?: true
  }

  export type ReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Report to aggregate.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reports
    **/
    _count?: true | ReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReportAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReportSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReportMaxAggregateInputType
  }

  export type GetReportAggregateType<T extends ReportAggregateArgs> = {
        [P in keyof T & keyof AggregateReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReport[P]>
      : GetScalarType<T[P], AggregateReport[P]>
  }




  export type ReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportWhereInput
    orderBy?: ReportOrderByWithAggregationInput | ReportOrderByWithAggregationInput[]
    by: ReportScalarFieldEnum[] | ReportScalarFieldEnum
    having?: ReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReportCountAggregateInputType | true
    _avg?: ReportAvgAggregateInputType
    _sum?: ReportSumAggregateInputType
    _min?: ReportMinAggregateInputType
    _max?: ReportMaxAggregateInputType
  }

  export type ReportGroupByOutputType = {
    createdAt: Date
    revenue: number
    fee: number
    transactionsId: number
    _count: ReportCountAggregateOutputType | null
    _avg: ReportAvgAggregateOutputType | null
    _sum: ReportSumAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  type GetReportGroupByPayload<T extends ReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReportGroupByOutputType[P]>
            : GetScalarType<T[P], ReportGroupByOutputType[P]>
        }
      >
    >


  export type ReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    createdAt?: boolean
    revenue?: boolean
    fee?: boolean
    transactionsId?: boolean
    transaction?: boolean | TransactionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["report"]>



  export type ReportSelectScalar = {
    createdAt?: boolean
    revenue?: boolean
    fee?: boolean
    transactionsId?: boolean
  }

  export type ReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"createdAt" | "revenue" | "fee" | "transactionsId", ExtArgs["result"]["report"]>
  export type ReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaction?: boolean | TransactionDefaultArgs<ExtArgs>
  }

  export type $ReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Report"
    objects: {
      transaction: Prisma.$TransactionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      createdAt: Date
      revenue: number
      fee: number
      transactionsId: number
    }, ExtArgs["result"]["report"]>
    composites: {}
  }

  type ReportGetPayload<S extends boolean | null | undefined | ReportDefaultArgs> = $Result.GetResult<Prisma.$ReportPayload, S>

  type ReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReportCountAggregateInputType | true
    }

  export interface ReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Report'], meta: { name: 'Report' } }
    /**
     * Find zero or one Report that matches the filter.
     * @param {ReportFindUniqueArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReportFindUniqueArgs>(args: SelectSubset<T, ReportFindUniqueArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Report that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReportFindUniqueOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReportFindUniqueOrThrowArgs>(args: SelectSubset<T, ReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Report that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReportFindFirstArgs>(args?: SelectSubset<T, ReportFindFirstArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Report that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReportFindFirstOrThrowArgs>(args?: SelectSubset<T, ReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reports
     * const reports = await prisma.report.findMany()
     * 
     * // Get first 10 Reports
     * const reports = await prisma.report.findMany({ take: 10 })
     * 
     * // Only select the `createdAt`
     * const reportWithCreatedAtOnly = await prisma.report.findMany({ select: { createdAt: true } })
     * 
     */
    findMany<T extends ReportFindManyArgs>(args?: SelectSubset<T, ReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Report.
     * @param {ReportCreateArgs} args - Arguments to create a Report.
     * @example
     * // Create one Report
     * const Report = await prisma.report.create({
     *   data: {
     *     // ... data to create a Report
     *   }
     * })
     * 
     */
    create<T extends ReportCreateArgs>(args: SelectSubset<T, ReportCreateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reports.
     * @param {ReportCreateManyArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const report = await prisma.report.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReportCreateManyArgs>(args?: SelectSubset<T, ReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Report.
     * @param {ReportDeleteArgs} args - Arguments to delete one Report.
     * @example
     * // Delete one Report
     * const Report = await prisma.report.delete({
     *   where: {
     *     // ... filter to delete one Report
     *   }
     * })
     * 
     */
    delete<T extends ReportDeleteArgs>(args: SelectSubset<T, ReportDeleteArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Report.
     * @param {ReportUpdateArgs} args - Arguments to update one Report.
     * @example
     * // Update one Report
     * const report = await prisma.report.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReportUpdateArgs>(args: SelectSubset<T, ReportUpdateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reports.
     * @param {ReportDeleteManyArgs} args - Arguments to filter Reports to delete.
     * @example
     * // Delete a few Reports
     * const { count } = await prisma.report.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReportDeleteManyArgs>(args?: SelectSubset<T, ReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reports
     * const report = await prisma.report.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReportUpdateManyArgs>(args: SelectSubset<T, ReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Report.
     * @param {ReportUpsertArgs} args - Arguments to update or create a Report.
     * @example
     * // Update or create a Report
     * const report = await prisma.report.upsert({
     *   create: {
     *     // ... data to create a Report
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Report we want to update
     *   }
     * })
     */
    upsert<T extends ReportUpsertArgs>(args: SelectSubset<T, ReportUpsertArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportCountArgs} args - Arguments to filter Reports to count.
     * @example
     * // Count the number of Reports
     * const count = await prisma.report.count({
     *   where: {
     *     // ... the filter for the Reports we want to count
     *   }
     * })
    **/
    count<T extends ReportCountArgs>(
      args?: Subset<T, ReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReportAggregateArgs>(args: Subset<T, ReportAggregateArgs>): Prisma.PrismaPromise<GetReportAggregateType<T>>

    /**
     * Group by Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReportGroupByArgs['orderBy'] }
        : { orderBy?: ReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Report model
   */
  readonly fields: ReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Report.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transaction<T extends TransactionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TransactionDefaultArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Report model
   */
  interface ReportFieldRefs {
    readonly createdAt: FieldRef<"Report", 'DateTime'>
    readonly revenue: FieldRef<"Report", 'Float'>
    readonly fee: FieldRef<"Report", 'Float'>
    readonly transactionsId: FieldRef<"Report", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Report findUnique
   */
  export type ReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findUniqueOrThrow
   */
  export type ReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findFirst
   */
  export type ReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findFirstOrThrow
   */
  export type ReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findMany
   */
  export type ReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Reports to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report create
   */
  export type ReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The data needed to create a Report.
     */
    data: XOR<ReportCreateInput, ReportUncheckedCreateInput>
  }

  /**
   * Report createMany
   */
  export type ReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reports.
     */
    data: ReportCreateManyInput | ReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Report update
   */
  export type ReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The data needed to update a Report.
     */
    data: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
    /**
     * Choose, which Report to update.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report updateMany
   */
  export type ReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reports.
     */
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyInput>
    /**
     * Filter which Reports to update
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to update.
     */
    limit?: number
  }

  /**
   * Report upsert
   */
  export type ReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The filter to search for the Report to update in case it exists.
     */
    where: ReportWhereUniqueInput
    /**
     * In case the Report found by the `where` argument doesn't exist, create a new Report with this data.
     */
    create: XOR<ReportCreateInput, ReportUncheckedCreateInput>
    /**
     * In case the Report was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
  }

  /**
   * Report delete
   */
  export type ReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter which Report to delete.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report deleteMany
   */
  export type ReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reports to delete
     */
    where?: ReportWhereInput
    /**
     * Limit how many Reports to delete.
     */
    limit?: number
  }

  /**
   * Report without action
   */
  export type ReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Report
     */
    omit?: ReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type NotificationSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type NotificationMinAggregateOutputType = {
    id: number | null
    userId: number | null
    content: string | null
    headline: string | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    content: string | null
    headline: string | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    content: number
    headline: number
    createdAt: number
    _all: number
  }


  export type NotificationAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type NotificationSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    content?: true
    headline?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    content?: true
    headline?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    content?: true
    headline?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _avg?: NotificationAvgAggregateInputType
    _sum?: NotificationSumAggregateInputType
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: number
    userId: number
    content: string
    headline: string
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    content?: boolean
    headline?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>



  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    content?: boolean
    headline?: boolean
    createdAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "content" | "headline" | "createdAt", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      content: string
      headline: string
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'Int'>
    readonly userId: FieldRef<"Notification", 'Int'>
    readonly content: FieldRef<"Notification", 'String'>
    readonly headline: FieldRef<"Notification", 'String'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CartScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    state: 'state',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CartScalarFieldEnum = (typeof CartScalarFieldEnum)[keyof typeof CartScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    phone: 'phone',
    address: 'address',
    role: 'role',
    couponCode: 'couponCode',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CartItemScalarFieldEnum: {
    id: 'id',
    cartId: 'cartId',
    clothesId: 'clothesId',
    totalprice: 'totalprice',
    quantity: 'quantity',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CartItemScalarFieldEnum = (typeof CartItemScalarFieldEnum)[keyof typeof CartItemScalarFieldEnum]


  export const ClothesScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    price: 'price',
    count: 'count',
    Color: 'Color',
    mainImgId: 'mainImgId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClothesScalarFieldEnum = (typeof ClothesScalarFieldEnum)[keyof typeof ClothesScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    Clothes_id: 'Clothes_id',
    name: 'name'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const ImageScalarFieldEnum: {
    id: 'id',
    name: 'name',
    url: 'url'
  };

  export type ImageScalarFieldEnum = (typeof ImageScalarFieldEnum)[keyof typeof ImageScalarFieldEnum]


  export const CommentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    clothesId: 'clothesId',
    content: 'content',
    point: 'point'
  };

  export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum]


  export const CouponScalarFieldEnum: {
    id: 'id',
    code: 'code',
    discount: 'discount',
    startDate: 'startDate',
    endDate: 'endDate',
    isActive: 'isActive',
    count: 'count'
  };

  export type CouponScalarFieldEnum = (typeof CouponScalarFieldEnum)[keyof typeof CouponScalarFieldEnum]


  export const ShippingScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    address: 'address',
    state: 'state',
    transID: 'transID',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ShippingScalarFieldEnum = (typeof ShippingScalarFieldEnum)[keyof typeof ShippingScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    totalprice: 'totalprice',
    PaymentId: 'PaymentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    fee: 'fee',
    method: 'method'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const ReportScalarFieldEnum: {
    createdAt: 'createdAt',
    revenue: 'revenue',
    fee: 'fee',
    transactionsId: 'transactionsId'
  };

  export type ReportScalarFieldEnum = (typeof ReportScalarFieldEnum)[keyof typeof ReportScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    content: 'content',
    headline: 'headline',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const UserOrderByRelevanceFieldEnum: {
    name: 'name',
    email: 'email',
    password: 'password',
    phone: 'phone',
    address: 'address',
    couponCode: 'couponCode'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const ClothesOrderByRelevanceFieldEnum: {
    name: 'name',
    description: 'description',
    Color: 'Color'
  };

  export type ClothesOrderByRelevanceFieldEnum = (typeof ClothesOrderByRelevanceFieldEnum)[keyof typeof ClothesOrderByRelevanceFieldEnum]


  export const CategoryOrderByRelevanceFieldEnum: {
    name: 'name'
  };

  export type CategoryOrderByRelevanceFieldEnum = (typeof CategoryOrderByRelevanceFieldEnum)[keyof typeof CategoryOrderByRelevanceFieldEnum]


  export const ImageOrderByRelevanceFieldEnum: {
    name: 'name',
    url: 'url'
  };

  export type ImageOrderByRelevanceFieldEnum = (typeof ImageOrderByRelevanceFieldEnum)[keyof typeof ImageOrderByRelevanceFieldEnum]


  export const CommentOrderByRelevanceFieldEnum: {
    content: 'content'
  };

  export type CommentOrderByRelevanceFieldEnum = (typeof CommentOrderByRelevanceFieldEnum)[keyof typeof CommentOrderByRelevanceFieldEnum]


  export const CouponOrderByRelevanceFieldEnum: {
    code: 'code'
  };

  export type CouponOrderByRelevanceFieldEnum = (typeof CouponOrderByRelevanceFieldEnum)[keyof typeof CouponOrderByRelevanceFieldEnum]


  export const ShippingOrderByRelevanceFieldEnum: {
    address: 'address'
  };

  export type ShippingOrderByRelevanceFieldEnum = (typeof ShippingOrderByRelevanceFieldEnum)[keyof typeof ShippingOrderByRelevanceFieldEnum]


  export const PaymentOrderByRelevanceFieldEnum: {
    method: 'method'
  };

  export type PaymentOrderByRelevanceFieldEnum = (typeof PaymentOrderByRelevanceFieldEnum)[keyof typeof PaymentOrderByRelevanceFieldEnum]


  export const NotificationOrderByRelevanceFieldEnum: {
    content: 'content',
    headline: 'headline'
  };

  export type NotificationOrderByRelevanceFieldEnum = (typeof NotificationOrderByRelevanceFieldEnum)[keyof typeof NotificationOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'State'
   */
  export type EnumStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'State'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type CartWhereInput = {
    AND?: CartWhereInput | CartWhereInput[]
    OR?: CartWhereInput[]
    NOT?: CartWhereInput | CartWhereInput[]
    id?: IntFilter<"Cart"> | number
    userId?: IntFilter<"Cart"> | number
    state?: EnumStateFilter<"Cart"> | $Enums.State
    createdAt?: DateTimeFilter<"Cart"> | Date | string
    updatedAt?: DateTimeFilter<"Cart"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    items?: CartItemListRelationFilter
  }

  export type CartOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    items?: CartItemOrderByRelationAggregateInput
  }

  export type CartWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CartWhereInput | CartWhereInput[]
    OR?: CartWhereInput[]
    NOT?: CartWhereInput | CartWhereInput[]
    userId?: IntFilter<"Cart"> | number
    state?: EnumStateFilter<"Cart"> | $Enums.State
    createdAt?: DateTimeFilter<"Cart"> | Date | string
    updatedAt?: DateTimeFilter<"Cart"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    items?: CartItemListRelationFilter
  }, "id">

  export type CartOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CartCountOrderByAggregateInput
    _avg?: CartAvgOrderByAggregateInput
    _max?: CartMaxOrderByAggregateInput
    _min?: CartMinOrderByAggregateInput
    _sum?: CartSumOrderByAggregateInput
  }

  export type CartScalarWhereWithAggregatesInput = {
    AND?: CartScalarWhereWithAggregatesInput | CartScalarWhereWithAggregatesInput[]
    OR?: CartScalarWhereWithAggregatesInput[]
    NOT?: CartScalarWhereWithAggregatesInput | CartScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Cart"> | number
    userId?: IntWithAggregatesFilter<"Cart"> | number
    state?: EnumStateWithAggregatesFilter<"Cart"> | $Enums.State
    createdAt?: DateTimeWithAggregatesFilter<"Cart"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Cart"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    address?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    couponCode?: StringNullableFilter<"User"> | string | null
    updatedAt?: DateTimeFilter<"User"> | Date | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    carts?: CartListRelationFilter
    coupon?: XOR<CouponNullableScalarRelationFilter, CouponWhereInput> | null
    Comment?: CommentListRelationFilter
    Shipping?: ShippingListRelationFilter
    transactions?: TransactionListRelationFilter
    Notification?: NotificationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    role?: SortOrder
    couponCode?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    carts?: CartOrderByRelationAggregateInput
    coupon?: CouponOrderByWithRelationInput
    Comment?: CommentOrderByRelationAggregateInput
    Shipping?: ShippingOrderByRelationAggregateInput
    transactions?: TransactionOrderByRelationAggregateInput
    Notification?: NotificationOrderByRelationAggregateInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    phone?: string
    couponCode?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    address?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    updatedAt?: DateTimeFilter<"User"> | Date | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    carts?: CartListRelationFilter
    coupon?: XOR<CouponNullableScalarRelationFilter, CouponWhereInput> | null
    Comment?: CommentListRelationFilter
    Shipping?: ShippingListRelationFilter
    transactions?: TransactionListRelationFilter
    Notification?: NotificationListRelationFilter
  }, "id" | "email" | "phone" | "couponCode">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    role?: SortOrder
    couponCode?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    phone?: StringWithAggregatesFilter<"User"> | string
    address?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    couponCode?: StringNullableWithAggregatesFilter<"User"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type CartItemWhereInput = {
    AND?: CartItemWhereInput | CartItemWhereInput[]
    OR?: CartItemWhereInput[]
    NOT?: CartItemWhereInput | CartItemWhereInput[]
    id?: IntFilter<"CartItem"> | number
    cartId?: IntFilter<"CartItem"> | number
    clothesId?: IntFilter<"CartItem"> | number
    totalprice?: FloatFilter<"CartItem"> | number
    quantity?: IntFilter<"CartItem"> | number
    createdAt?: DateTimeFilter<"CartItem"> | Date | string
    updatedAt?: DateTimeFilter<"CartItem"> | Date | string
    clothes?: XOR<ClothesScalarRelationFilter, ClothesWhereInput>
    cart?: XOR<CartScalarRelationFilter, CartWhereInput>
  }

  export type CartItemOrderByWithRelationInput = {
    id?: SortOrder
    cartId?: SortOrder
    clothesId?: SortOrder
    totalprice?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clothes?: ClothesOrderByWithRelationInput
    cart?: CartOrderByWithRelationInput
  }

  export type CartItemWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CartItemWhereInput | CartItemWhereInput[]
    OR?: CartItemWhereInput[]
    NOT?: CartItemWhereInput | CartItemWhereInput[]
    cartId?: IntFilter<"CartItem"> | number
    clothesId?: IntFilter<"CartItem"> | number
    totalprice?: FloatFilter<"CartItem"> | number
    quantity?: IntFilter<"CartItem"> | number
    createdAt?: DateTimeFilter<"CartItem"> | Date | string
    updatedAt?: DateTimeFilter<"CartItem"> | Date | string
    clothes?: XOR<ClothesScalarRelationFilter, ClothesWhereInput>
    cart?: XOR<CartScalarRelationFilter, CartWhereInput>
  }, "id">

  export type CartItemOrderByWithAggregationInput = {
    id?: SortOrder
    cartId?: SortOrder
    clothesId?: SortOrder
    totalprice?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CartItemCountOrderByAggregateInput
    _avg?: CartItemAvgOrderByAggregateInput
    _max?: CartItemMaxOrderByAggregateInput
    _min?: CartItemMinOrderByAggregateInput
    _sum?: CartItemSumOrderByAggregateInput
  }

  export type CartItemScalarWhereWithAggregatesInput = {
    AND?: CartItemScalarWhereWithAggregatesInput | CartItemScalarWhereWithAggregatesInput[]
    OR?: CartItemScalarWhereWithAggregatesInput[]
    NOT?: CartItemScalarWhereWithAggregatesInput | CartItemScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CartItem"> | number
    cartId?: IntWithAggregatesFilter<"CartItem"> | number
    clothesId?: IntWithAggregatesFilter<"CartItem"> | number
    totalprice?: FloatWithAggregatesFilter<"CartItem"> | number
    quantity?: IntWithAggregatesFilter<"CartItem"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CartItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CartItem"> | Date | string
  }

  export type ClothesWhereInput = {
    AND?: ClothesWhereInput | ClothesWhereInput[]
    OR?: ClothesWhereInput[]
    NOT?: ClothesWhereInput | ClothesWhereInput[]
    id?: IntFilter<"Clothes"> | number
    name?: StringFilter<"Clothes"> | string
    description?: StringFilter<"Clothes"> | string
    price?: FloatFilter<"Clothes"> | number
    count?: IntFilter<"Clothes"> | number
    Color?: StringFilter<"Clothes"> | string
    mainImgId?: IntNullableFilter<"Clothes"> | number | null
    createdAt?: DateTimeFilter<"Clothes"> | Date | string
    updatedAt?: DateTimeFilter<"Clothes"> | Date | string
    cartItems?: CartItemListRelationFilter
    mainImg?: XOR<ImageNullableScalarRelationFilter, ImageWhereInput> | null
    Category?: CategoryListRelationFilter
    comments?: CommentListRelationFilter
  }

  export type ClothesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    count?: SortOrder
    Color?: SortOrder
    mainImgId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cartItems?: CartItemOrderByRelationAggregateInput
    mainImg?: ImageOrderByWithRelationInput
    Category?: CategoryOrderByRelationAggregateInput
    comments?: CommentOrderByRelationAggregateInput
    _relevance?: ClothesOrderByRelevanceInput
  }

  export type ClothesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    mainImgId?: number
    AND?: ClothesWhereInput | ClothesWhereInput[]
    OR?: ClothesWhereInput[]
    NOT?: ClothesWhereInput | ClothesWhereInput[]
    description?: StringFilter<"Clothes"> | string
    price?: FloatFilter<"Clothes"> | number
    count?: IntFilter<"Clothes"> | number
    Color?: StringFilter<"Clothes"> | string
    createdAt?: DateTimeFilter<"Clothes"> | Date | string
    updatedAt?: DateTimeFilter<"Clothes"> | Date | string
    cartItems?: CartItemListRelationFilter
    mainImg?: XOR<ImageNullableScalarRelationFilter, ImageWhereInput> | null
    Category?: CategoryListRelationFilter
    comments?: CommentListRelationFilter
  }, "id" | "name" | "mainImgId">

  export type ClothesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    count?: SortOrder
    Color?: SortOrder
    mainImgId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClothesCountOrderByAggregateInput
    _avg?: ClothesAvgOrderByAggregateInput
    _max?: ClothesMaxOrderByAggregateInput
    _min?: ClothesMinOrderByAggregateInput
    _sum?: ClothesSumOrderByAggregateInput
  }

  export type ClothesScalarWhereWithAggregatesInput = {
    AND?: ClothesScalarWhereWithAggregatesInput | ClothesScalarWhereWithAggregatesInput[]
    OR?: ClothesScalarWhereWithAggregatesInput[]
    NOT?: ClothesScalarWhereWithAggregatesInput | ClothesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Clothes"> | number
    name?: StringWithAggregatesFilter<"Clothes"> | string
    description?: StringWithAggregatesFilter<"Clothes"> | string
    price?: FloatWithAggregatesFilter<"Clothes"> | number
    count?: IntWithAggregatesFilter<"Clothes"> | number
    Color?: StringWithAggregatesFilter<"Clothes"> | string
    mainImgId?: IntNullableWithAggregatesFilter<"Clothes"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Clothes"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Clothes"> | Date | string
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: IntFilter<"Category"> | number
    Clothes_id?: IntFilter<"Category"> | number
    name?: StringFilter<"Category"> | string
    Clothes?: XOR<ClothesScalarRelationFilter, ClothesWhereInput>
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    Clothes_id?: SortOrder
    name?: SortOrder
    Clothes?: ClothesOrderByWithRelationInput
    _relevance?: CategoryOrderByRelevanceInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    Clothes_id?: number
    name?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    Clothes?: XOR<ClothesScalarRelationFilter, ClothesWhereInput>
  }, "id" | "Clothes_id" | "name">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    Clothes_id?: SortOrder
    name?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _avg?: CategoryAvgOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
    _sum?: CategorySumOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Category"> | number
    Clothes_id?: IntWithAggregatesFilter<"Category"> | number
    name?: StringWithAggregatesFilter<"Category"> | string
  }

  export type ImageWhereInput = {
    AND?: ImageWhereInput | ImageWhereInput[]
    OR?: ImageWhereInput[]
    NOT?: ImageWhereInput | ImageWhereInput[]
    id?: IntFilter<"Image"> | number
    name?: StringFilter<"Image"> | string
    url?: StringFilter<"Image"> | string
    clothesMain?: XOR<ClothesNullableScalarRelationFilter, ClothesWhereInput> | null
  }

  export type ImageOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    clothesMain?: ClothesOrderByWithRelationInput
    _relevance?: ImageOrderByRelevanceInput
  }

  export type ImageWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    url?: string
    AND?: ImageWhereInput | ImageWhereInput[]
    OR?: ImageWhereInput[]
    NOT?: ImageWhereInput | ImageWhereInput[]
    name?: StringFilter<"Image"> | string
    clothesMain?: XOR<ClothesNullableScalarRelationFilter, ClothesWhereInput> | null
  }, "id" | "url">

  export type ImageOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    _count?: ImageCountOrderByAggregateInput
    _avg?: ImageAvgOrderByAggregateInput
    _max?: ImageMaxOrderByAggregateInput
    _min?: ImageMinOrderByAggregateInput
    _sum?: ImageSumOrderByAggregateInput
  }

  export type ImageScalarWhereWithAggregatesInput = {
    AND?: ImageScalarWhereWithAggregatesInput | ImageScalarWhereWithAggregatesInput[]
    OR?: ImageScalarWhereWithAggregatesInput[]
    NOT?: ImageScalarWhereWithAggregatesInput | ImageScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Image"> | number
    name?: StringWithAggregatesFilter<"Image"> | string
    url?: StringWithAggregatesFilter<"Image"> | string
  }

  export type CommentWhereInput = {
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    id?: IntFilter<"Comment"> | number
    userId?: IntFilter<"Comment"> | number
    clothesId?: IntFilter<"Comment"> | number
    content?: StringFilter<"Comment"> | string
    point?: IntFilter<"Comment"> | number
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    clothes?: XOR<ClothesScalarRelationFilter, ClothesWhereInput>
  }

  export type CommentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    clothesId?: SortOrder
    content?: SortOrder
    point?: SortOrder
    user?: UserOrderByWithRelationInput
    clothes?: ClothesOrderByWithRelationInput
    _relevance?: CommentOrderByRelevanceInput
  }

  export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    userId?: IntFilter<"Comment"> | number
    clothesId?: IntFilter<"Comment"> | number
    content?: StringFilter<"Comment"> | string
    point?: IntFilter<"Comment"> | number
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    clothes?: XOR<ClothesScalarRelationFilter, ClothesWhereInput>
  }, "id">

  export type CommentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    clothesId?: SortOrder
    content?: SortOrder
    point?: SortOrder
    _count?: CommentCountOrderByAggregateInput
    _avg?: CommentAvgOrderByAggregateInput
    _max?: CommentMaxOrderByAggregateInput
    _min?: CommentMinOrderByAggregateInput
    _sum?: CommentSumOrderByAggregateInput
  }

  export type CommentScalarWhereWithAggregatesInput = {
    AND?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    OR?: CommentScalarWhereWithAggregatesInput[]
    NOT?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Comment"> | number
    userId?: IntWithAggregatesFilter<"Comment"> | number
    clothesId?: IntWithAggregatesFilter<"Comment"> | number
    content?: StringWithAggregatesFilter<"Comment"> | string
    point?: IntWithAggregatesFilter<"Comment"> | number
  }

  export type CouponWhereInput = {
    AND?: CouponWhereInput | CouponWhereInput[]
    OR?: CouponWhereInput[]
    NOT?: CouponWhereInput | CouponWhereInput[]
    id?: IntFilter<"Coupon"> | number
    code?: StringFilter<"Coupon"> | string
    discount?: FloatFilter<"Coupon"> | number
    startDate?: DateTimeFilter<"Coupon"> | Date | string
    endDate?: DateTimeFilter<"Coupon"> | Date | string
    isActive?: BoolFilter<"Coupon"> | boolean
    count?: IntFilter<"Coupon"> | number
    user?: UserListRelationFilter
  }

  export type CouponOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    discount?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    count?: SortOrder
    user?: UserOrderByRelationAggregateInput
    _relevance?: CouponOrderByRelevanceInput
  }

  export type CouponWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    code?: string
    AND?: CouponWhereInput | CouponWhereInput[]
    OR?: CouponWhereInput[]
    NOT?: CouponWhereInput | CouponWhereInput[]
    discount?: FloatFilter<"Coupon"> | number
    startDate?: DateTimeFilter<"Coupon"> | Date | string
    endDate?: DateTimeFilter<"Coupon"> | Date | string
    isActive?: BoolFilter<"Coupon"> | boolean
    count?: IntFilter<"Coupon"> | number
    user?: UserListRelationFilter
  }, "id" | "code">

  export type CouponOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    discount?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    count?: SortOrder
    _count?: CouponCountOrderByAggregateInput
    _avg?: CouponAvgOrderByAggregateInput
    _max?: CouponMaxOrderByAggregateInput
    _min?: CouponMinOrderByAggregateInput
    _sum?: CouponSumOrderByAggregateInput
  }

  export type CouponScalarWhereWithAggregatesInput = {
    AND?: CouponScalarWhereWithAggregatesInput | CouponScalarWhereWithAggregatesInput[]
    OR?: CouponScalarWhereWithAggregatesInput[]
    NOT?: CouponScalarWhereWithAggregatesInput | CouponScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Coupon"> | number
    code?: StringWithAggregatesFilter<"Coupon"> | string
    discount?: FloatWithAggregatesFilter<"Coupon"> | number
    startDate?: DateTimeWithAggregatesFilter<"Coupon"> | Date | string
    endDate?: DateTimeWithAggregatesFilter<"Coupon"> | Date | string
    isActive?: BoolWithAggregatesFilter<"Coupon"> | boolean
    count?: IntWithAggregatesFilter<"Coupon"> | number
  }

  export type ShippingWhereInput = {
    AND?: ShippingWhereInput | ShippingWhereInput[]
    OR?: ShippingWhereInput[]
    NOT?: ShippingWhereInput | ShippingWhereInput[]
    id?: IntFilter<"Shipping"> | number
    userId?: IntFilter<"Shipping"> | number
    address?: StringFilter<"Shipping"> | string
    state?: EnumStateFilter<"Shipping"> | $Enums.State
    transID?: IntFilter<"Shipping"> | number
    createdAt?: DateTimeFilter<"Shipping"> | Date | string
    updatedAt?: DateTimeFilter<"Shipping"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    transaction?: XOR<TransactionScalarRelationFilter, TransactionWhereInput>
  }

  export type ShippingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    address?: SortOrder
    state?: SortOrder
    transID?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    transaction?: TransactionOrderByWithRelationInput
    _relevance?: ShippingOrderByRelevanceInput
  }

  export type ShippingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ShippingWhereInput | ShippingWhereInput[]
    OR?: ShippingWhereInput[]
    NOT?: ShippingWhereInput | ShippingWhereInput[]
    userId?: IntFilter<"Shipping"> | number
    address?: StringFilter<"Shipping"> | string
    state?: EnumStateFilter<"Shipping"> | $Enums.State
    transID?: IntFilter<"Shipping"> | number
    createdAt?: DateTimeFilter<"Shipping"> | Date | string
    updatedAt?: DateTimeFilter<"Shipping"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    transaction?: XOR<TransactionScalarRelationFilter, TransactionWhereInput>
  }, "id">

  export type ShippingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    address?: SortOrder
    state?: SortOrder
    transID?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ShippingCountOrderByAggregateInput
    _avg?: ShippingAvgOrderByAggregateInput
    _max?: ShippingMaxOrderByAggregateInput
    _min?: ShippingMinOrderByAggregateInput
    _sum?: ShippingSumOrderByAggregateInput
  }

  export type ShippingScalarWhereWithAggregatesInput = {
    AND?: ShippingScalarWhereWithAggregatesInput | ShippingScalarWhereWithAggregatesInput[]
    OR?: ShippingScalarWhereWithAggregatesInput[]
    NOT?: ShippingScalarWhereWithAggregatesInput | ShippingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Shipping"> | number
    userId?: IntWithAggregatesFilter<"Shipping"> | number
    address?: StringWithAggregatesFilter<"Shipping"> | string
    state?: EnumStateWithAggregatesFilter<"Shipping"> | $Enums.State
    transID?: IntWithAggregatesFilter<"Shipping"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Shipping"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Shipping"> | Date | string
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: IntFilter<"Transaction"> | number
    userId?: IntFilter<"Transaction"> | number
    totalprice?: FloatFilter<"Transaction"> | number
    PaymentId?: IntFilter<"Transaction"> | number
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    payment?: XOR<PaymentScalarRelationFilter, PaymentWhereInput>
    Shipping?: ShippingListRelationFilter
    Report?: ReportListRelationFilter
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    totalprice?: SortOrder
    PaymentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    payment?: PaymentOrderByWithRelationInput
    Shipping?: ShippingOrderByRelationAggregateInput
    Report?: ReportOrderByRelationAggregateInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    userId?: IntFilter<"Transaction"> | number
    totalprice?: FloatFilter<"Transaction"> | number
    PaymentId?: IntFilter<"Transaction"> | number
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    payment?: XOR<PaymentScalarRelationFilter, PaymentWhereInput>
    Shipping?: ShippingListRelationFilter
    Report?: ReportListRelationFilter
  }, "id">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    totalprice?: SortOrder
    PaymentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Transaction"> | number
    userId?: IntWithAggregatesFilter<"Transaction"> | number
    totalprice?: FloatWithAggregatesFilter<"Transaction"> | number
    PaymentId?: IntWithAggregatesFilter<"Transaction"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: IntFilter<"Payment"> | number
    fee?: FloatFilter<"Payment"> | number
    method?: StringFilter<"Payment"> | string
    Transaction?: TransactionListRelationFilter
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    fee?: SortOrder
    method?: SortOrder
    Transaction?: TransactionOrderByRelationAggregateInput
    _relevance?: PaymentOrderByRelevanceInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    fee?: FloatFilter<"Payment"> | number
    method?: StringFilter<"Payment"> | string
    Transaction?: TransactionListRelationFilter
  }, "id">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    fee?: SortOrder
    method?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Payment"> | number
    fee?: FloatWithAggregatesFilter<"Payment"> | number
    method?: StringWithAggregatesFilter<"Payment"> | string
  }

  export type ReportWhereInput = {
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    createdAt?: DateTimeFilter<"Report"> | Date | string
    revenue?: FloatFilter<"Report"> | number
    fee?: FloatFilter<"Report"> | number
    transactionsId?: IntFilter<"Report"> | number
    transaction?: XOR<TransactionScalarRelationFilter, TransactionWhereInput>
  }

  export type ReportOrderByWithRelationInput = {
    createdAt?: SortOrder
    revenue?: SortOrder
    fee?: SortOrder
    transactionsId?: SortOrder
    transaction?: TransactionOrderByWithRelationInput
  }

  export type ReportWhereUniqueInput = Prisma.AtLeast<{
    createdAt?: Date | string
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    revenue?: FloatFilter<"Report"> | number
    fee?: FloatFilter<"Report"> | number
    transactionsId?: IntFilter<"Report"> | number
    transaction?: XOR<TransactionScalarRelationFilter, TransactionWhereInput>
  }, "createdAt" | "createdAt">

  export type ReportOrderByWithAggregationInput = {
    createdAt?: SortOrder
    revenue?: SortOrder
    fee?: SortOrder
    transactionsId?: SortOrder
    _count?: ReportCountOrderByAggregateInput
    _avg?: ReportAvgOrderByAggregateInput
    _max?: ReportMaxOrderByAggregateInput
    _min?: ReportMinOrderByAggregateInput
    _sum?: ReportSumOrderByAggregateInput
  }

  export type ReportScalarWhereWithAggregatesInput = {
    AND?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    OR?: ReportScalarWhereWithAggregatesInput[]
    NOT?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    createdAt?: DateTimeWithAggregatesFilter<"Report"> | Date | string
    revenue?: FloatWithAggregatesFilter<"Report"> | number
    fee?: FloatWithAggregatesFilter<"Report"> | number
    transactionsId?: IntWithAggregatesFilter<"Report"> | number
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: IntFilter<"Notification"> | number
    userId?: IntFilter<"Notification"> | number
    content?: StringFilter<"Notification"> | string
    headline?: StringFilter<"Notification"> | string
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    headline?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    _relevance?: NotificationOrderByRelevanceInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: IntFilter<"Notification"> | number
    content?: StringFilter<"Notification"> | string
    headline?: StringFilter<"Notification"> | string
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    headline?: SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _avg?: NotificationAvgOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
    _sum?: NotificationSumOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Notification"> | number
    userId?: IntWithAggregatesFilter<"Notification"> | number
    content?: StringWithAggregatesFilter<"Notification"> | string
    headline?: StringWithAggregatesFilter<"Notification"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type CartCreateInput = {
    state?: $Enums.State
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCartsInput
    items?: CartItemCreateNestedManyWithoutCartInput
  }

  export type CartUncheckedCreateInput = {
    id?: number
    userId: number
    state?: $Enums.State
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: CartItemUncheckedCreateNestedManyWithoutCartInput
  }

  export type CartUpdateInput = {
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCartsNestedInput
    items?: CartItemUpdateManyWithoutCartNestedInput
  }

  export type CartUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: CartItemUncheckedUpdateManyWithoutCartNestedInput
  }

  export type CartCreateManyInput = {
    id?: number
    userId: number
    state?: $Enums.State
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartUpdateManyMutationInput = {
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    updatedAt?: Date | string
    createdAt?: Date | string
    carts?: CartCreateNestedManyWithoutUserInput
    coupon?: CouponCreateNestedOneWithoutUserInput
    Comment?: CommentCreateNestedManyWithoutUserInput
    Shipping?: ShippingCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
    Notification?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    couponCode?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    carts?: CartUncheckedCreateNestedManyWithoutUserInput
    Comment?: CommentUncheckedCreateNestedManyWithoutUserInput
    Shipping?: ShippingUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carts?: CartUpdateManyWithoutUserNestedInput
    coupon?: CouponUpdateOneWithoutUserNestedInput
    Comment?: CommentUpdateManyWithoutUserNestedInput
    Shipping?: ShippingUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    Notification?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carts?: CartUncheckedUpdateManyWithoutUserNestedInput
    Comment?: CommentUncheckedUpdateManyWithoutUserNestedInput
    Shipping?: ShippingUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    couponCode?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemCreateInput = {
    totalprice?: number
    quantity: number
    createdAt?: Date | string
    updatedAt?: Date | string
    clothes: ClothesCreateNestedOneWithoutCartItemsInput
    cart: CartCreateNestedOneWithoutItemsInput
  }

  export type CartItemUncheckedCreateInput = {
    id?: number
    cartId: number
    clothesId: number
    totalprice?: number
    quantity: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemUpdateInput = {
    totalprice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clothes?: ClothesUpdateOneRequiredWithoutCartItemsNestedInput
    cart?: CartUpdateOneRequiredWithoutItemsNestedInput
  }

  export type CartItemUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    cartId?: IntFieldUpdateOperationsInput | number
    clothesId?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemCreateManyInput = {
    id?: number
    cartId: number
    clothesId: number
    totalprice?: number
    quantity: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemUpdateManyMutationInput = {
    totalprice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    cartId?: IntFieldUpdateOperationsInput | number
    clothesId?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClothesCreateInput = {
    name: string
    description: string
    price: number
    count: number
    Color: string
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemCreateNestedManyWithoutClothesInput
    mainImg?: ImageCreateNestedOneWithoutClothesMainInput
    Category?: CategoryCreateNestedManyWithoutClothesInput
    comments?: CommentCreateNestedManyWithoutClothesInput
  }

  export type ClothesUncheckedCreateInput = {
    id?: number
    name: string
    description: string
    price: number
    count: number
    Color: string
    mainImgId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemUncheckedCreateNestedManyWithoutClothesInput
    Category?: CategoryUncheckedCreateNestedManyWithoutClothesInput
    comments?: CommentUncheckedCreateNestedManyWithoutClothesInput
  }

  export type ClothesUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    count?: IntFieldUpdateOperationsInput | number
    Color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUpdateManyWithoutClothesNestedInput
    mainImg?: ImageUpdateOneWithoutClothesMainNestedInput
    Category?: CategoryUpdateManyWithoutClothesNestedInput
    comments?: CommentUpdateManyWithoutClothesNestedInput
  }

  export type ClothesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    count?: IntFieldUpdateOperationsInput | number
    Color?: StringFieldUpdateOperationsInput | string
    mainImgId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUncheckedUpdateManyWithoutClothesNestedInput
    Category?: CategoryUncheckedUpdateManyWithoutClothesNestedInput
    comments?: CommentUncheckedUpdateManyWithoutClothesNestedInput
  }

  export type ClothesCreateManyInput = {
    id?: number
    name: string
    description: string
    price: number
    count: number
    Color: string
    mainImgId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClothesUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    count?: IntFieldUpdateOperationsInput | number
    Color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClothesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    count?: IntFieldUpdateOperationsInput | number
    Color?: StringFieldUpdateOperationsInput | string
    mainImgId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryCreateInput = {
    name: string
    Clothes: ClothesCreateNestedOneWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: number
    Clothes_id: number
    name: string
  }

  export type CategoryUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    Clothes?: ClothesUpdateOneRequiredWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    Clothes_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type CategoryCreateManyInput = {
    id?: number
    Clothes_id: number
    name: string
  }

  export type CategoryUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    Clothes_id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ImageCreateInput = {
    name: string
    url: string
    clothesMain?: ClothesCreateNestedOneWithoutMainImgInput
  }

  export type ImageUncheckedCreateInput = {
    id?: number
    name: string
    url: string
    clothesMain?: ClothesUncheckedCreateNestedOneWithoutMainImgInput
  }

  export type ImageUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    clothesMain?: ClothesUpdateOneWithoutMainImgNestedInput
  }

  export type ImageUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    clothesMain?: ClothesUncheckedUpdateOneWithoutMainImgNestedInput
  }

  export type ImageCreateManyInput = {
    id?: number
    name: string
    url: string
  }

  export type ImageUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
  }

  export type ImageUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
  }

  export type CommentCreateInput = {
    content: string
    point: number
    user: UserCreateNestedOneWithoutCommentInput
    clothes: ClothesCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateInput = {
    id?: number
    userId: number
    clothesId: number
    content: string
    point: number
  }

  export type CommentUpdateInput = {
    content?: StringFieldUpdateOperationsInput | string
    point?: IntFieldUpdateOperationsInput | number
    user?: UserUpdateOneRequiredWithoutCommentNestedInput
    clothes?: ClothesUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    clothesId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    point?: IntFieldUpdateOperationsInput | number
  }

  export type CommentCreateManyInput = {
    id?: number
    userId: number
    clothesId: number
    content: string
    point: number
  }

  export type CommentUpdateManyMutationInput = {
    content?: StringFieldUpdateOperationsInput | string
    point?: IntFieldUpdateOperationsInput | number
  }

  export type CommentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    clothesId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    point?: IntFieldUpdateOperationsInput | number
  }

  export type CouponCreateInput = {
    code: string
    discount: number
    startDate?: Date | string
    endDate?: Date | string
    isActive?: boolean
    count: number
    user?: UserCreateNestedManyWithoutCouponInput
  }

  export type CouponUncheckedCreateInput = {
    id?: number
    code: string
    discount: number
    startDate?: Date | string
    endDate?: Date | string
    isActive?: boolean
    count: number
    user?: UserUncheckedCreateNestedManyWithoutCouponInput
  }

  export type CouponUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    discount?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    count?: IntFieldUpdateOperationsInput | number
    user?: UserUpdateManyWithoutCouponNestedInput
  }

  export type CouponUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    discount?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    count?: IntFieldUpdateOperationsInput | number
    user?: UserUncheckedUpdateManyWithoutCouponNestedInput
  }

  export type CouponCreateManyInput = {
    id?: number
    code: string
    discount: number
    startDate?: Date | string
    endDate?: Date | string
    isActive?: boolean
    count: number
  }

  export type CouponUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    discount?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    count?: IntFieldUpdateOperationsInput | number
  }

  export type CouponUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    discount?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    count?: IntFieldUpdateOperationsInput | number
  }

  export type ShippingCreateInput = {
    address: string
    state?: $Enums.State
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutShippingInput
    transaction: TransactionCreateNestedOneWithoutShippingInput
  }

  export type ShippingUncheckedCreateInput = {
    id?: number
    userId: number
    address: string
    state?: $Enums.State
    transID: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShippingUpdateInput = {
    address?: StringFieldUpdateOperationsInput | string
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutShippingNestedInput
    transaction?: TransactionUpdateOneRequiredWithoutShippingNestedInput
  }

  export type ShippingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    transID?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShippingCreateManyInput = {
    id?: number
    userId: number
    address: string
    state?: $Enums.State
    transID: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShippingUpdateManyMutationInput = {
    address?: StringFieldUpdateOperationsInput | string
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShippingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    transID?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateInput = {
    totalprice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTransactionsInput
    payment: PaymentCreateNestedOneWithoutTransactionInput
    Shipping?: ShippingCreateNestedManyWithoutTransactionInput
    Report?: ReportCreateNestedManyWithoutTransactionInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: number
    userId: number
    totalprice: number
    PaymentId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    Shipping?: ShippingUncheckedCreateNestedManyWithoutTransactionInput
    Report?: ReportUncheckedCreateNestedManyWithoutTransactionInput
  }

  export type TransactionUpdateInput = {
    totalprice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput
    payment?: PaymentUpdateOneRequiredWithoutTransactionNestedInput
    Shipping?: ShippingUpdateManyWithoutTransactionNestedInput
    Report?: ReportUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    PaymentId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Shipping?: ShippingUncheckedUpdateManyWithoutTransactionNestedInput
    Report?: ReportUncheckedUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionCreateManyInput = {
    id?: number
    userId: number
    totalprice: number
    PaymentId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    totalprice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    PaymentId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateInput = {
    fee: number
    method: string
    Transaction?: TransactionCreateNestedManyWithoutPaymentInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: number
    fee: number
    method: string
    Transaction?: TransactionUncheckedCreateNestedManyWithoutPaymentInput
  }

  export type PaymentUpdateInput = {
    fee?: FloatFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    Transaction?: TransactionUpdateManyWithoutPaymentNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    fee?: FloatFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
    Transaction?: TransactionUncheckedUpdateManyWithoutPaymentNestedInput
  }

  export type PaymentCreateManyInput = {
    id?: number
    fee: number
    method: string
  }

  export type PaymentUpdateManyMutationInput = {
    fee?: FloatFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    fee?: FloatFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
  }

  export type ReportCreateInput = {
    createdAt?: Date | string
    revenue: number
    fee: number
    transaction: TransactionCreateNestedOneWithoutReportInput
  }

  export type ReportUncheckedCreateInput = {
    createdAt?: Date | string
    revenue: number
    fee: number
    transactionsId: number
  }

  export type ReportUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revenue?: FloatFieldUpdateOperationsInput | number
    fee?: FloatFieldUpdateOperationsInput | number
    transaction?: TransactionUpdateOneRequiredWithoutReportNestedInput
  }

  export type ReportUncheckedUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revenue?: FloatFieldUpdateOperationsInput | number
    fee?: FloatFieldUpdateOperationsInput | number
    transactionsId?: IntFieldUpdateOperationsInput | number
  }

  export type ReportCreateManyInput = {
    createdAt?: Date | string
    revenue: number
    fee: number
    transactionsId: number
  }

  export type ReportUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revenue?: FloatFieldUpdateOperationsInput | number
    fee?: FloatFieldUpdateOperationsInput | number
  }

  export type ReportUncheckedUpdateManyInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revenue?: FloatFieldUpdateOperationsInput | number
    fee?: FloatFieldUpdateOperationsInput | number
    transactionsId?: IntFieldUpdateOperationsInput | number
  }

  export type NotificationCreateInput = {
    content: string
    headline: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: number
    userId: number
    content: string
    headline: string
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    content?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: number
    userId: number
    content: string
    headline: string
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    content?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumStateFilter<$PrismaModel = never> = {
    equals?: $Enums.State | EnumStateFieldRefInput<$PrismaModel>
    in?: $Enums.State[]
    notIn?: $Enums.State[]
    not?: NestedEnumStateFilter<$PrismaModel> | $Enums.State
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CartItemListRelationFilter = {
    every?: CartItemWhereInput
    some?: CartItemWhereInput
    none?: CartItemWhereInput
  }

  export type CartItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CartCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type CartMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.State | EnumStateFieldRefInput<$PrismaModel>
    in?: $Enums.State[]
    notIn?: $Enums.State[]
    not?: NestedEnumStateWithAggregatesFilter<$PrismaModel> | $Enums.State
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStateFilter<$PrismaModel>
    _max?: NestedEnumStateFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type CartListRelationFilter = {
    every?: CartWhereInput
    some?: CartWhereInput
    none?: CartWhereInput
  }

  export type CouponNullableScalarRelationFilter = {
    is?: CouponWhereInput | null
    isNot?: CouponWhereInput | null
  }

  export type CommentListRelationFilter = {
    every?: CommentWhereInput
    some?: CommentWhereInput
    none?: CommentWhereInput
  }

  export type ShippingListRelationFilter = {
    every?: ShippingWhereInput
    some?: ShippingWhereInput
    none?: ShippingWhereInput
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CartOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ShippingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    role?: SortOrder
    couponCode?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    role?: SortOrder
    couponCode?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    role?: SortOrder
    couponCode?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ClothesScalarRelationFilter = {
    is?: ClothesWhereInput
    isNot?: ClothesWhereInput
  }

  export type CartScalarRelationFilter = {
    is?: CartWhereInput
    isNot?: CartWhereInput
  }

  export type CartItemCountOrderByAggregateInput = {
    id?: SortOrder
    cartId?: SortOrder
    clothesId?: SortOrder
    totalprice?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartItemAvgOrderByAggregateInput = {
    id?: SortOrder
    cartId?: SortOrder
    clothesId?: SortOrder
    totalprice?: SortOrder
    quantity?: SortOrder
  }

  export type CartItemMaxOrderByAggregateInput = {
    id?: SortOrder
    cartId?: SortOrder
    clothesId?: SortOrder
    totalprice?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartItemMinOrderByAggregateInput = {
    id?: SortOrder
    cartId?: SortOrder
    clothesId?: SortOrder
    totalprice?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CartItemSumOrderByAggregateInput = {
    id?: SortOrder
    cartId?: SortOrder
    clothesId?: SortOrder
    totalprice?: SortOrder
    quantity?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ImageNullableScalarRelationFilter = {
    is?: ImageWhereInput | null
    isNot?: ImageWhereInput | null
  }

  export type CategoryListRelationFilter = {
    every?: CategoryWhereInput
    some?: CategoryWhereInput
    none?: CategoryWhereInput
  }

  export type CategoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClothesOrderByRelevanceInput = {
    fields: ClothesOrderByRelevanceFieldEnum | ClothesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ClothesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    count?: SortOrder
    Color?: SortOrder
    mainImgId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClothesAvgOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
    count?: SortOrder
    mainImgId?: SortOrder
  }

  export type ClothesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    count?: SortOrder
    Color?: SortOrder
    mainImgId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClothesMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    count?: SortOrder
    Color?: SortOrder
    mainImgId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClothesSumOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
    count?: SortOrder
    mainImgId?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type CategoryOrderByRelevanceInput = {
    fields: CategoryOrderByRelevanceFieldEnum | CategoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    Clothes_id?: SortOrder
    name?: SortOrder
  }

  export type CategoryAvgOrderByAggregateInput = {
    id?: SortOrder
    Clothes_id?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    Clothes_id?: SortOrder
    name?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    Clothes_id?: SortOrder
    name?: SortOrder
  }

  export type CategorySumOrderByAggregateInput = {
    id?: SortOrder
    Clothes_id?: SortOrder
  }

  export type ClothesNullableScalarRelationFilter = {
    is?: ClothesWhereInput | null
    isNot?: ClothesWhereInput | null
  }

  export type ImageOrderByRelevanceInput = {
    fields: ImageOrderByRelevanceFieldEnum | ImageOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ImageCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
  }

  export type ImageAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ImageMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
  }

  export type ImageMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
  }

  export type ImageSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CommentOrderByRelevanceInput = {
    fields: CommentOrderByRelevanceFieldEnum | CommentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CommentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    clothesId?: SortOrder
    content?: SortOrder
    point?: SortOrder
  }

  export type CommentAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    clothesId?: SortOrder
    point?: SortOrder
  }

  export type CommentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    clothesId?: SortOrder
    content?: SortOrder
    point?: SortOrder
  }

  export type CommentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    clothesId?: SortOrder
    content?: SortOrder
    point?: SortOrder
  }

  export type CommentSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    clothesId?: SortOrder
    point?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CouponOrderByRelevanceInput = {
    fields: CouponOrderByRelevanceFieldEnum | CouponOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CouponCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    discount?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    count?: SortOrder
  }

  export type CouponAvgOrderByAggregateInput = {
    id?: SortOrder
    discount?: SortOrder
    count?: SortOrder
  }

  export type CouponMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    discount?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    count?: SortOrder
  }

  export type CouponMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    discount?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    count?: SortOrder
  }

  export type CouponSumOrderByAggregateInput = {
    id?: SortOrder
    discount?: SortOrder
    count?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type TransactionScalarRelationFilter = {
    is?: TransactionWhereInput
    isNot?: TransactionWhereInput
  }

  export type ShippingOrderByRelevanceInput = {
    fields: ShippingOrderByRelevanceFieldEnum | ShippingOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ShippingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    address?: SortOrder
    state?: SortOrder
    transID?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShippingAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    transID?: SortOrder
  }

  export type ShippingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    address?: SortOrder
    state?: SortOrder
    transID?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShippingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    address?: SortOrder
    state?: SortOrder
    transID?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShippingSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    transID?: SortOrder
  }

  export type PaymentScalarRelationFilter = {
    is?: PaymentWhereInput
    isNot?: PaymentWhereInput
  }

  export type ReportListRelationFilter = {
    every?: ReportWhereInput
    some?: ReportWhereInput
    none?: ReportWhereInput
  }

  export type ReportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    totalprice?: SortOrder
    PaymentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    totalprice?: SortOrder
    PaymentId?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    totalprice?: SortOrder
    PaymentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    totalprice?: SortOrder
    PaymentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    totalprice?: SortOrder
    PaymentId?: SortOrder
  }

  export type PaymentOrderByRelevanceInput = {
    fields: PaymentOrderByRelevanceFieldEnum | PaymentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    fee?: SortOrder
    method?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    id?: SortOrder
    fee?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    fee?: SortOrder
    method?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    fee?: SortOrder
    method?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    id?: SortOrder
    fee?: SortOrder
  }

  export type ReportCountOrderByAggregateInput = {
    createdAt?: SortOrder
    revenue?: SortOrder
    fee?: SortOrder
    transactionsId?: SortOrder
  }

  export type ReportAvgOrderByAggregateInput = {
    revenue?: SortOrder
    fee?: SortOrder
    transactionsId?: SortOrder
  }

  export type ReportMaxOrderByAggregateInput = {
    createdAt?: SortOrder
    revenue?: SortOrder
    fee?: SortOrder
    transactionsId?: SortOrder
  }

  export type ReportMinOrderByAggregateInput = {
    createdAt?: SortOrder
    revenue?: SortOrder
    fee?: SortOrder
    transactionsId?: SortOrder
  }

  export type ReportSumOrderByAggregateInput = {
    revenue?: SortOrder
    fee?: SortOrder
    transactionsId?: SortOrder
  }

  export type NotificationOrderByRelevanceInput = {
    fields: NotificationOrderByRelevanceFieldEnum | NotificationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    headline?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    headline?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    headline?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type UserCreateNestedOneWithoutCartsInput = {
    create?: XOR<UserCreateWithoutCartsInput, UserUncheckedCreateWithoutCartsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCartsInput
    connect?: UserWhereUniqueInput
  }

  export type CartItemCreateNestedManyWithoutCartInput = {
    create?: XOR<CartItemCreateWithoutCartInput, CartItemUncheckedCreateWithoutCartInput> | CartItemCreateWithoutCartInput[] | CartItemUncheckedCreateWithoutCartInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutCartInput | CartItemCreateOrConnectWithoutCartInput[]
    createMany?: CartItemCreateManyCartInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type CartItemUncheckedCreateNestedManyWithoutCartInput = {
    create?: XOR<CartItemCreateWithoutCartInput, CartItemUncheckedCreateWithoutCartInput> | CartItemCreateWithoutCartInput[] | CartItemUncheckedCreateWithoutCartInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutCartInput | CartItemCreateOrConnectWithoutCartInput[]
    createMany?: CartItemCreateManyCartInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type EnumStateFieldUpdateOperationsInput = {
    set?: $Enums.State
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateOneRequiredWithoutCartsNestedInput = {
    create?: XOR<UserCreateWithoutCartsInput, UserUncheckedCreateWithoutCartsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCartsInput
    upsert?: UserUpsertWithoutCartsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCartsInput, UserUpdateWithoutCartsInput>, UserUncheckedUpdateWithoutCartsInput>
  }

  export type CartItemUpdateManyWithoutCartNestedInput = {
    create?: XOR<CartItemCreateWithoutCartInput, CartItemUncheckedCreateWithoutCartInput> | CartItemCreateWithoutCartInput[] | CartItemUncheckedCreateWithoutCartInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutCartInput | CartItemCreateOrConnectWithoutCartInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutCartInput | CartItemUpsertWithWhereUniqueWithoutCartInput[]
    createMany?: CartItemCreateManyCartInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutCartInput | CartItemUpdateWithWhereUniqueWithoutCartInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutCartInput | CartItemUpdateManyWithWhereWithoutCartInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CartItemUncheckedUpdateManyWithoutCartNestedInput = {
    create?: XOR<CartItemCreateWithoutCartInput, CartItemUncheckedCreateWithoutCartInput> | CartItemCreateWithoutCartInput[] | CartItemUncheckedCreateWithoutCartInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutCartInput | CartItemCreateOrConnectWithoutCartInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutCartInput | CartItemUpsertWithWhereUniqueWithoutCartInput[]
    createMany?: CartItemCreateManyCartInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutCartInput | CartItemUpdateWithWhereUniqueWithoutCartInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutCartInput | CartItemUpdateManyWithWhereWithoutCartInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type CartCreateNestedManyWithoutUserInput = {
    create?: XOR<CartCreateWithoutUserInput, CartUncheckedCreateWithoutUserInput> | CartCreateWithoutUserInput[] | CartUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CartCreateOrConnectWithoutUserInput | CartCreateOrConnectWithoutUserInput[]
    createMany?: CartCreateManyUserInputEnvelope
    connect?: CartWhereUniqueInput | CartWhereUniqueInput[]
  }

  export type CouponCreateNestedOneWithoutUserInput = {
    create?: XOR<CouponCreateWithoutUserInput, CouponUncheckedCreateWithoutUserInput>
    connectOrCreate?: CouponCreateOrConnectWithoutUserInput
    connect?: CouponWhereUniqueInput
  }

  export type CommentCreateNestedManyWithoutUserInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type ShippingCreateNestedManyWithoutUserInput = {
    create?: XOR<ShippingCreateWithoutUserInput, ShippingUncheckedCreateWithoutUserInput> | ShippingCreateWithoutUserInput[] | ShippingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ShippingCreateOrConnectWithoutUserInput | ShippingCreateOrConnectWithoutUserInput[]
    createMany?: ShippingCreateManyUserInputEnvelope
    connect?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type CartUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CartCreateWithoutUserInput, CartUncheckedCreateWithoutUserInput> | CartCreateWithoutUserInput[] | CartUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CartCreateOrConnectWithoutUserInput | CartCreateOrConnectWithoutUserInput[]
    createMany?: CartCreateManyUserInputEnvelope
    connect?: CartWhereUniqueInput | CartWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type ShippingUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ShippingCreateWithoutUserInput, ShippingUncheckedCreateWithoutUserInput> | ShippingCreateWithoutUserInput[] | ShippingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ShippingCreateOrConnectWithoutUserInput | ShippingCreateOrConnectWithoutUserInput[]
    createMany?: ShippingCreateManyUserInputEnvelope
    connect?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type CartUpdateManyWithoutUserNestedInput = {
    create?: XOR<CartCreateWithoutUserInput, CartUncheckedCreateWithoutUserInput> | CartCreateWithoutUserInput[] | CartUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CartCreateOrConnectWithoutUserInput | CartCreateOrConnectWithoutUserInput[]
    upsert?: CartUpsertWithWhereUniqueWithoutUserInput | CartUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CartCreateManyUserInputEnvelope
    set?: CartWhereUniqueInput | CartWhereUniqueInput[]
    disconnect?: CartWhereUniqueInput | CartWhereUniqueInput[]
    delete?: CartWhereUniqueInput | CartWhereUniqueInput[]
    connect?: CartWhereUniqueInput | CartWhereUniqueInput[]
    update?: CartUpdateWithWhereUniqueWithoutUserInput | CartUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CartUpdateManyWithWhereWithoutUserInput | CartUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CartScalarWhereInput | CartScalarWhereInput[]
  }

  export type CouponUpdateOneWithoutUserNestedInput = {
    create?: XOR<CouponCreateWithoutUserInput, CouponUncheckedCreateWithoutUserInput>
    connectOrCreate?: CouponCreateOrConnectWithoutUserInput
    upsert?: CouponUpsertWithoutUserInput
    disconnect?: CouponWhereInput | boolean
    delete?: CouponWhereInput | boolean
    connect?: CouponWhereUniqueInput
    update?: XOR<XOR<CouponUpdateToOneWithWhereWithoutUserInput, CouponUpdateWithoutUserInput>, CouponUncheckedUpdateWithoutUserInput>
  }

  export type CommentUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutUserInput | CommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutUserInput | CommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutUserInput | CommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type ShippingUpdateManyWithoutUserNestedInput = {
    create?: XOR<ShippingCreateWithoutUserInput, ShippingUncheckedCreateWithoutUserInput> | ShippingCreateWithoutUserInput[] | ShippingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ShippingCreateOrConnectWithoutUserInput | ShippingCreateOrConnectWithoutUserInput[]
    upsert?: ShippingUpsertWithWhereUniqueWithoutUserInput | ShippingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ShippingCreateManyUserInputEnvelope
    set?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    disconnect?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    delete?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    connect?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    update?: ShippingUpdateWithWhereUniqueWithoutUserInput | ShippingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ShippingUpdateManyWithWhereWithoutUserInput | ShippingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ShippingScalarWhereInput | ShippingScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutUserInput | TransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutUserInput | TransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutUserInput | TransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type CartUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CartCreateWithoutUserInput, CartUncheckedCreateWithoutUserInput> | CartCreateWithoutUserInput[] | CartUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CartCreateOrConnectWithoutUserInput | CartCreateOrConnectWithoutUserInput[]
    upsert?: CartUpsertWithWhereUniqueWithoutUserInput | CartUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CartCreateManyUserInputEnvelope
    set?: CartWhereUniqueInput | CartWhereUniqueInput[]
    disconnect?: CartWhereUniqueInput | CartWhereUniqueInput[]
    delete?: CartWhereUniqueInput | CartWhereUniqueInput[]
    connect?: CartWhereUniqueInput | CartWhereUniqueInput[]
    update?: CartUpdateWithWhereUniqueWithoutUserInput | CartUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CartUpdateManyWithWhereWithoutUserInput | CartUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CartScalarWhereInput | CartScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutUserInput | CommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutUserInput | CommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutUserInput | CommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type ShippingUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ShippingCreateWithoutUserInput, ShippingUncheckedCreateWithoutUserInput> | ShippingCreateWithoutUserInput[] | ShippingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ShippingCreateOrConnectWithoutUserInput | ShippingCreateOrConnectWithoutUserInput[]
    upsert?: ShippingUpsertWithWhereUniqueWithoutUserInput | ShippingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ShippingCreateManyUserInputEnvelope
    set?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    disconnect?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    delete?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    connect?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    update?: ShippingUpdateWithWhereUniqueWithoutUserInput | ShippingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ShippingUpdateManyWithWhereWithoutUserInput | ShippingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ShippingScalarWhereInput | ShippingScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutUserInput | TransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutUserInput | TransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutUserInput | TransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type ClothesCreateNestedOneWithoutCartItemsInput = {
    create?: XOR<ClothesCreateWithoutCartItemsInput, ClothesUncheckedCreateWithoutCartItemsInput>
    connectOrCreate?: ClothesCreateOrConnectWithoutCartItemsInput
    connect?: ClothesWhereUniqueInput
  }

  export type CartCreateNestedOneWithoutItemsInput = {
    create?: XOR<CartCreateWithoutItemsInput, CartUncheckedCreateWithoutItemsInput>
    connectOrCreate?: CartCreateOrConnectWithoutItemsInput
    connect?: CartWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ClothesUpdateOneRequiredWithoutCartItemsNestedInput = {
    create?: XOR<ClothesCreateWithoutCartItemsInput, ClothesUncheckedCreateWithoutCartItemsInput>
    connectOrCreate?: ClothesCreateOrConnectWithoutCartItemsInput
    upsert?: ClothesUpsertWithoutCartItemsInput
    connect?: ClothesWhereUniqueInput
    update?: XOR<XOR<ClothesUpdateToOneWithWhereWithoutCartItemsInput, ClothesUpdateWithoutCartItemsInput>, ClothesUncheckedUpdateWithoutCartItemsInput>
  }

  export type CartUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<CartCreateWithoutItemsInput, CartUncheckedCreateWithoutItemsInput>
    connectOrCreate?: CartCreateOrConnectWithoutItemsInput
    upsert?: CartUpsertWithoutItemsInput
    connect?: CartWhereUniqueInput
    update?: XOR<XOR<CartUpdateToOneWithWhereWithoutItemsInput, CartUpdateWithoutItemsInput>, CartUncheckedUpdateWithoutItemsInput>
  }

  export type CartItemCreateNestedManyWithoutClothesInput = {
    create?: XOR<CartItemCreateWithoutClothesInput, CartItemUncheckedCreateWithoutClothesInput> | CartItemCreateWithoutClothesInput[] | CartItemUncheckedCreateWithoutClothesInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutClothesInput | CartItemCreateOrConnectWithoutClothesInput[]
    createMany?: CartItemCreateManyClothesInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type ImageCreateNestedOneWithoutClothesMainInput = {
    create?: XOR<ImageCreateWithoutClothesMainInput, ImageUncheckedCreateWithoutClothesMainInput>
    connectOrCreate?: ImageCreateOrConnectWithoutClothesMainInput
    connect?: ImageWhereUniqueInput
  }

  export type CategoryCreateNestedManyWithoutClothesInput = {
    create?: XOR<CategoryCreateWithoutClothesInput, CategoryUncheckedCreateWithoutClothesInput> | CategoryCreateWithoutClothesInput[] | CategoryUncheckedCreateWithoutClothesInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutClothesInput | CategoryCreateOrConnectWithoutClothesInput[]
    createMany?: CategoryCreateManyClothesInputEnvelope
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
  }

  export type CommentCreateNestedManyWithoutClothesInput = {
    create?: XOR<CommentCreateWithoutClothesInput, CommentUncheckedCreateWithoutClothesInput> | CommentCreateWithoutClothesInput[] | CommentUncheckedCreateWithoutClothesInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutClothesInput | CommentCreateOrConnectWithoutClothesInput[]
    createMany?: CommentCreateManyClothesInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type CartItemUncheckedCreateNestedManyWithoutClothesInput = {
    create?: XOR<CartItemCreateWithoutClothesInput, CartItemUncheckedCreateWithoutClothesInput> | CartItemCreateWithoutClothesInput[] | CartItemUncheckedCreateWithoutClothesInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutClothesInput | CartItemCreateOrConnectWithoutClothesInput[]
    createMany?: CartItemCreateManyClothesInputEnvelope
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
  }

  export type CategoryUncheckedCreateNestedManyWithoutClothesInput = {
    create?: XOR<CategoryCreateWithoutClothesInput, CategoryUncheckedCreateWithoutClothesInput> | CategoryCreateWithoutClothesInput[] | CategoryUncheckedCreateWithoutClothesInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutClothesInput | CategoryCreateOrConnectWithoutClothesInput[]
    createMany?: CategoryCreateManyClothesInputEnvelope
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutClothesInput = {
    create?: XOR<CommentCreateWithoutClothesInput, CommentUncheckedCreateWithoutClothesInput> | CommentCreateWithoutClothesInput[] | CommentUncheckedCreateWithoutClothesInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutClothesInput | CommentCreateOrConnectWithoutClothesInput[]
    createMany?: CommentCreateManyClothesInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type CartItemUpdateManyWithoutClothesNestedInput = {
    create?: XOR<CartItemCreateWithoutClothesInput, CartItemUncheckedCreateWithoutClothesInput> | CartItemCreateWithoutClothesInput[] | CartItemUncheckedCreateWithoutClothesInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutClothesInput | CartItemCreateOrConnectWithoutClothesInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutClothesInput | CartItemUpsertWithWhereUniqueWithoutClothesInput[]
    createMany?: CartItemCreateManyClothesInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutClothesInput | CartItemUpdateWithWhereUniqueWithoutClothesInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutClothesInput | CartItemUpdateManyWithWhereWithoutClothesInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type ImageUpdateOneWithoutClothesMainNestedInput = {
    create?: XOR<ImageCreateWithoutClothesMainInput, ImageUncheckedCreateWithoutClothesMainInput>
    connectOrCreate?: ImageCreateOrConnectWithoutClothesMainInput
    upsert?: ImageUpsertWithoutClothesMainInput
    disconnect?: ImageWhereInput | boolean
    delete?: ImageWhereInput | boolean
    connect?: ImageWhereUniqueInput
    update?: XOR<XOR<ImageUpdateToOneWithWhereWithoutClothesMainInput, ImageUpdateWithoutClothesMainInput>, ImageUncheckedUpdateWithoutClothesMainInput>
  }

  export type CategoryUpdateManyWithoutClothesNestedInput = {
    create?: XOR<CategoryCreateWithoutClothesInput, CategoryUncheckedCreateWithoutClothesInput> | CategoryCreateWithoutClothesInput[] | CategoryUncheckedCreateWithoutClothesInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutClothesInput | CategoryCreateOrConnectWithoutClothesInput[]
    upsert?: CategoryUpsertWithWhereUniqueWithoutClothesInput | CategoryUpsertWithWhereUniqueWithoutClothesInput[]
    createMany?: CategoryCreateManyClothesInputEnvelope
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    update?: CategoryUpdateWithWhereUniqueWithoutClothesInput | CategoryUpdateWithWhereUniqueWithoutClothesInput[]
    updateMany?: CategoryUpdateManyWithWhereWithoutClothesInput | CategoryUpdateManyWithWhereWithoutClothesInput[]
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
  }

  export type CommentUpdateManyWithoutClothesNestedInput = {
    create?: XOR<CommentCreateWithoutClothesInput, CommentUncheckedCreateWithoutClothesInput> | CommentCreateWithoutClothesInput[] | CommentUncheckedCreateWithoutClothesInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutClothesInput | CommentCreateOrConnectWithoutClothesInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutClothesInput | CommentUpsertWithWhereUniqueWithoutClothesInput[]
    createMany?: CommentCreateManyClothesInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutClothesInput | CommentUpdateWithWhereUniqueWithoutClothesInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutClothesInput | CommentUpdateManyWithWhereWithoutClothesInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CartItemUncheckedUpdateManyWithoutClothesNestedInput = {
    create?: XOR<CartItemCreateWithoutClothesInput, CartItemUncheckedCreateWithoutClothesInput> | CartItemCreateWithoutClothesInput[] | CartItemUncheckedCreateWithoutClothesInput[]
    connectOrCreate?: CartItemCreateOrConnectWithoutClothesInput | CartItemCreateOrConnectWithoutClothesInput[]
    upsert?: CartItemUpsertWithWhereUniqueWithoutClothesInput | CartItemUpsertWithWhereUniqueWithoutClothesInput[]
    createMany?: CartItemCreateManyClothesInputEnvelope
    set?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    disconnect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    delete?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    connect?: CartItemWhereUniqueInput | CartItemWhereUniqueInput[]
    update?: CartItemUpdateWithWhereUniqueWithoutClothesInput | CartItemUpdateWithWhereUniqueWithoutClothesInput[]
    updateMany?: CartItemUpdateManyWithWhereWithoutClothesInput | CartItemUpdateManyWithWhereWithoutClothesInput[]
    deleteMany?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
  }

  export type CategoryUncheckedUpdateManyWithoutClothesNestedInput = {
    create?: XOR<CategoryCreateWithoutClothesInput, CategoryUncheckedCreateWithoutClothesInput> | CategoryCreateWithoutClothesInput[] | CategoryUncheckedCreateWithoutClothesInput[]
    connectOrCreate?: CategoryCreateOrConnectWithoutClothesInput | CategoryCreateOrConnectWithoutClothesInput[]
    upsert?: CategoryUpsertWithWhereUniqueWithoutClothesInput | CategoryUpsertWithWhereUniqueWithoutClothesInput[]
    createMany?: CategoryCreateManyClothesInputEnvelope
    set?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    disconnect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    delete?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    connect?: CategoryWhereUniqueInput | CategoryWhereUniqueInput[]
    update?: CategoryUpdateWithWhereUniqueWithoutClothesInput | CategoryUpdateWithWhereUniqueWithoutClothesInput[]
    updateMany?: CategoryUpdateManyWithWhereWithoutClothesInput | CategoryUpdateManyWithWhereWithoutClothesInput[]
    deleteMany?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutClothesNestedInput = {
    create?: XOR<CommentCreateWithoutClothesInput, CommentUncheckedCreateWithoutClothesInput> | CommentCreateWithoutClothesInput[] | CommentUncheckedCreateWithoutClothesInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutClothesInput | CommentCreateOrConnectWithoutClothesInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutClothesInput | CommentUpsertWithWhereUniqueWithoutClothesInput[]
    createMany?: CommentCreateManyClothesInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutClothesInput | CommentUpdateWithWhereUniqueWithoutClothesInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutClothesInput | CommentUpdateManyWithWhereWithoutClothesInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type ClothesCreateNestedOneWithoutCategoryInput = {
    create?: XOR<ClothesCreateWithoutCategoryInput, ClothesUncheckedCreateWithoutCategoryInput>
    connectOrCreate?: ClothesCreateOrConnectWithoutCategoryInput
    connect?: ClothesWhereUniqueInput
  }

  export type ClothesUpdateOneRequiredWithoutCategoryNestedInput = {
    create?: XOR<ClothesCreateWithoutCategoryInput, ClothesUncheckedCreateWithoutCategoryInput>
    connectOrCreate?: ClothesCreateOrConnectWithoutCategoryInput
    upsert?: ClothesUpsertWithoutCategoryInput
    connect?: ClothesWhereUniqueInput
    update?: XOR<XOR<ClothesUpdateToOneWithWhereWithoutCategoryInput, ClothesUpdateWithoutCategoryInput>, ClothesUncheckedUpdateWithoutCategoryInput>
  }

  export type ClothesCreateNestedOneWithoutMainImgInput = {
    create?: XOR<ClothesCreateWithoutMainImgInput, ClothesUncheckedCreateWithoutMainImgInput>
    connectOrCreate?: ClothesCreateOrConnectWithoutMainImgInput
    connect?: ClothesWhereUniqueInput
  }

  export type ClothesUncheckedCreateNestedOneWithoutMainImgInput = {
    create?: XOR<ClothesCreateWithoutMainImgInput, ClothesUncheckedCreateWithoutMainImgInput>
    connectOrCreate?: ClothesCreateOrConnectWithoutMainImgInput
    connect?: ClothesWhereUniqueInput
  }

  export type ClothesUpdateOneWithoutMainImgNestedInput = {
    create?: XOR<ClothesCreateWithoutMainImgInput, ClothesUncheckedCreateWithoutMainImgInput>
    connectOrCreate?: ClothesCreateOrConnectWithoutMainImgInput
    upsert?: ClothesUpsertWithoutMainImgInput
    disconnect?: ClothesWhereInput | boolean
    delete?: ClothesWhereInput | boolean
    connect?: ClothesWhereUniqueInput
    update?: XOR<XOR<ClothesUpdateToOneWithWhereWithoutMainImgInput, ClothesUpdateWithoutMainImgInput>, ClothesUncheckedUpdateWithoutMainImgInput>
  }

  export type ClothesUncheckedUpdateOneWithoutMainImgNestedInput = {
    create?: XOR<ClothesCreateWithoutMainImgInput, ClothesUncheckedCreateWithoutMainImgInput>
    connectOrCreate?: ClothesCreateOrConnectWithoutMainImgInput
    upsert?: ClothesUpsertWithoutMainImgInput
    disconnect?: ClothesWhereInput | boolean
    delete?: ClothesWhereInput | boolean
    connect?: ClothesWhereUniqueInput
    update?: XOR<XOR<ClothesUpdateToOneWithWhereWithoutMainImgInput, ClothesUpdateWithoutMainImgInput>, ClothesUncheckedUpdateWithoutMainImgInput>
  }

  export type UserCreateNestedOneWithoutCommentInput = {
    create?: XOR<UserCreateWithoutCommentInput, UserUncheckedCreateWithoutCommentInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentInput
    connect?: UserWhereUniqueInput
  }

  export type ClothesCreateNestedOneWithoutCommentsInput = {
    create?: XOR<ClothesCreateWithoutCommentsInput, ClothesUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: ClothesCreateOrConnectWithoutCommentsInput
    connect?: ClothesWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutCommentNestedInput = {
    create?: XOR<UserCreateWithoutCommentInput, UserUncheckedCreateWithoutCommentInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentInput
    upsert?: UserUpsertWithoutCommentInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCommentInput, UserUpdateWithoutCommentInput>, UserUncheckedUpdateWithoutCommentInput>
  }

  export type ClothesUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<ClothesCreateWithoutCommentsInput, ClothesUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: ClothesCreateOrConnectWithoutCommentsInput
    upsert?: ClothesUpsertWithoutCommentsInput
    connect?: ClothesWhereUniqueInput
    update?: XOR<XOR<ClothesUpdateToOneWithWhereWithoutCommentsInput, ClothesUpdateWithoutCommentsInput>, ClothesUncheckedUpdateWithoutCommentsInput>
  }

  export type UserCreateNestedManyWithoutCouponInput = {
    create?: XOR<UserCreateWithoutCouponInput, UserUncheckedCreateWithoutCouponInput> | UserCreateWithoutCouponInput[] | UserUncheckedCreateWithoutCouponInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCouponInput | UserCreateOrConnectWithoutCouponInput[]
    createMany?: UserCreateManyCouponInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutCouponInput = {
    create?: XOR<UserCreateWithoutCouponInput, UserUncheckedCreateWithoutCouponInput> | UserCreateWithoutCouponInput[] | UserUncheckedCreateWithoutCouponInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCouponInput | UserCreateOrConnectWithoutCouponInput[]
    createMany?: UserCreateManyCouponInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateManyWithoutCouponNestedInput = {
    create?: XOR<UserCreateWithoutCouponInput, UserUncheckedCreateWithoutCouponInput> | UserCreateWithoutCouponInput[] | UserUncheckedCreateWithoutCouponInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCouponInput | UserCreateOrConnectWithoutCouponInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutCouponInput | UserUpsertWithWhereUniqueWithoutCouponInput[]
    createMany?: UserCreateManyCouponInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutCouponInput | UserUpdateWithWhereUniqueWithoutCouponInput[]
    updateMany?: UserUpdateManyWithWhereWithoutCouponInput | UserUpdateManyWithWhereWithoutCouponInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutCouponNestedInput = {
    create?: XOR<UserCreateWithoutCouponInput, UserUncheckedCreateWithoutCouponInput> | UserCreateWithoutCouponInput[] | UserUncheckedCreateWithoutCouponInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCouponInput | UserCreateOrConnectWithoutCouponInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutCouponInput | UserUpsertWithWhereUniqueWithoutCouponInput[]
    createMany?: UserCreateManyCouponInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutCouponInput | UserUpdateWithWhereUniqueWithoutCouponInput[]
    updateMany?: UserUpdateManyWithWhereWithoutCouponInput | UserUpdateManyWithWhereWithoutCouponInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutShippingInput = {
    create?: XOR<UserCreateWithoutShippingInput, UserUncheckedCreateWithoutShippingInput>
    connectOrCreate?: UserCreateOrConnectWithoutShippingInput
    connect?: UserWhereUniqueInput
  }

  export type TransactionCreateNestedOneWithoutShippingInput = {
    create?: XOR<TransactionCreateWithoutShippingInput, TransactionUncheckedCreateWithoutShippingInput>
    connectOrCreate?: TransactionCreateOrConnectWithoutShippingInput
    connect?: TransactionWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutShippingNestedInput = {
    create?: XOR<UserCreateWithoutShippingInput, UserUncheckedCreateWithoutShippingInput>
    connectOrCreate?: UserCreateOrConnectWithoutShippingInput
    upsert?: UserUpsertWithoutShippingInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutShippingInput, UserUpdateWithoutShippingInput>, UserUncheckedUpdateWithoutShippingInput>
  }

  export type TransactionUpdateOneRequiredWithoutShippingNestedInput = {
    create?: XOR<TransactionCreateWithoutShippingInput, TransactionUncheckedCreateWithoutShippingInput>
    connectOrCreate?: TransactionCreateOrConnectWithoutShippingInput
    upsert?: TransactionUpsertWithoutShippingInput
    connect?: TransactionWhereUniqueInput
    update?: XOR<XOR<TransactionUpdateToOneWithWhereWithoutShippingInput, TransactionUpdateWithoutShippingInput>, TransactionUncheckedUpdateWithoutShippingInput>
  }

  export type UserCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput
    connect?: UserWhereUniqueInput
  }

  export type PaymentCreateNestedOneWithoutTransactionInput = {
    create?: XOR<PaymentCreateWithoutTransactionInput, PaymentUncheckedCreateWithoutTransactionInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutTransactionInput
    connect?: PaymentWhereUniqueInput
  }

  export type ShippingCreateNestedManyWithoutTransactionInput = {
    create?: XOR<ShippingCreateWithoutTransactionInput, ShippingUncheckedCreateWithoutTransactionInput> | ShippingCreateWithoutTransactionInput[] | ShippingUncheckedCreateWithoutTransactionInput[]
    connectOrCreate?: ShippingCreateOrConnectWithoutTransactionInput | ShippingCreateOrConnectWithoutTransactionInput[]
    createMany?: ShippingCreateManyTransactionInputEnvelope
    connect?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
  }

  export type ReportCreateNestedManyWithoutTransactionInput = {
    create?: XOR<ReportCreateWithoutTransactionInput, ReportUncheckedCreateWithoutTransactionInput> | ReportCreateWithoutTransactionInput[] | ReportUncheckedCreateWithoutTransactionInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutTransactionInput | ReportCreateOrConnectWithoutTransactionInput[]
    createMany?: ReportCreateManyTransactionInputEnvelope
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
  }

  export type ShippingUncheckedCreateNestedManyWithoutTransactionInput = {
    create?: XOR<ShippingCreateWithoutTransactionInput, ShippingUncheckedCreateWithoutTransactionInput> | ShippingCreateWithoutTransactionInput[] | ShippingUncheckedCreateWithoutTransactionInput[]
    connectOrCreate?: ShippingCreateOrConnectWithoutTransactionInput | ShippingCreateOrConnectWithoutTransactionInput[]
    createMany?: ShippingCreateManyTransactionInputEnvelope
    connect?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
  }

  export type ReportUncheckedCreateNestedManyWithoutTransactionInput = {
    create?: XOR<ReportCreateWithoutTransactionInput, ReportUncheckedCreateWithoutTransactionInput> | ReportCreateWithoutTransactionInput[] | ReportUncheckedCreateWithoutTransactionInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutTransactionInput | ReportCreateOrConnectWithoutTransactionInput[]
    createMany?: ReportCreateManyTransactionInputEnvelope
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput
    upsert?: UserUpsertWithoutTransactionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionsInput, UserUpdateWithoutTransactionsInput>, UserUncheckedUpdateWithoutTransactionsInput>
  }

  export type PaymentUpdateOneRequiredWithoutTransactionNestedInput = {
    create?: XOR<PaymentCreateWithoutTransactionInput, PaymentUncheckedCreateWithoutTransactionInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutTransactionInput
    upsert?: PaymentUpsertWithoutTransactionInput
    connect?: PaymentWhereUniqueInput
    update?: XOR<XOR<PaymentUpdateToOneWithWhereWithoutTransactionInput, PaymentUpdateWithoutTransactionInput>, PaymentUncheckedUpdateWithoutTransactionInput>
  }

  export type ShippingUpdateManyWithoutTransactionNestedInput = {
    create?: XOR<ShippingCreateWithoutTransactionInput, ShippingUncheckedCreateWithoutTransactionInput> | ShippingCreateWithoutTransactionInput[] | ShippingUncheckedCreateWithoutTransactionInput[]
    connectOrCreate?: ShippingCreateOrConnectWithoutTransactionInput | ShippingCreateOrConnectWithoutTransactionInput[]
    upsert?: ShippingUpsertWithWhereUniqueWithoutTransactionInput | ShippingUpsertWithWhereUniqueWithoutTransactionInput[]
    createMany?: ShippingCreateManyTransactionInputEnvelope
    set?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    disconnect?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    delete?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    connect?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    update?: ShippingUpdateWithWhereUniqueWithoutTransactionInput | ShippingUpdateWithWhereUniqueWithoutTransactionInput[]
    updateMany?: ShippingUpdateManyWithWhereWithoutTransactionInput | ShippingUpdateManyWithWhereWithoutTransactionInput[]
    deleteMany?: ShippingScalarWhereInput | ShippingScalarWhereInput[]
  }

  export type ReportUpdateManyWithoutTransactionNestedInput = {
    create?: XOR<ReportCreateWithoutTransactionInput, ReportUncheckedCreateWithoutTransactionInput> | ReportCreateWithoutTransactionInput[] | ReportUncheckedCreateWithoutTransactionInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutTransactionInput | ReportCreateOrConnectWithoutTransactionInput[]
    upsert?: ReportUpsertWithWhereUniqueWithoutTransactionInput | ReportUpsertWithWhereUniqueWithoutTransactionInput[]
    createMany?: ReportCreateManyTransactionInputEnvelope
    set?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    disconnect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    delete?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    update?: ReportUpdateWithWhereUniqueWithoutTransactionInput | ReportUpdateWithWhereUniqueWithoutTransactionInput[]
    updateMany?: ReportUpdateManyWithWhereWithoutTransactionInput | ReportUpdateManyWithWhereWithoutTransactionInput[]
    deleteMany?: ReportScalarWhereInput | ReportScalarWhereInput[]
  }

  export type ShippingUncheckedUpdateManyWithoutTransactionNestedInput = {
    create?: XOR<ShippingCreateWithoutTransactionInput, ShippingUncheckedCreateWithoutTransactionInput> | ShippingCreateWithoutTransactionInput[] | ShippingUncheckedCreateWithoutTransactionInput[]
    connectOrCreate?: ShippingCreateOrConnectWithoutTransactionInput | ShippingCreateOrConnectWithoutTransactionInput[]
    upsert?: ShippingUpsertWithWhereUniqueWithoutTransactionInput | ShippingUpsertWithWhereUniqueWithoutTransactionInput[]
    createMany?: ShippingCreateManyTransactionInputEnvelope
    set?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    disconnect?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    delete?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    connect?: ShippingWhereUniqueInput | ShippingWhereUniqueInput[]
    update?: ShippingUpdateWithWhereUniqueWithoutTransactionInput | ShippingUpdateWithWhereUniqueWithoutTransactionInput[]
    updateMany?: ShippingUpdateManyWithWhereWithoutTransactionInput | ShippingUpdateManyWithWhereWithoutTransactionInput[]
    deleteMany?: ShippingScalarWhereInput | ShippingScalarWhereInput[]
  }

  export type ReportUncheckedUpdateManyWithoutTransactionNestedInput = {
    create?: XOR<ReportCreateWithoutTransactionInput, ReportUncheckedCreateWithoutTransactionInput> | ReportCreateWithoutTransactionInput[] | ReportUncheckedCreateWithoutTransactionInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutTransactionInput | ReportCreateOrConnectWithoutTransactionInput[]
    upsert?: ReportUpsertWithWhereUniqueWithoutTransactionInput | ReportUpsertWithWhereUniqueWithoutTransactionInput[]
    createMany?: ReportCreateManyTransactionInputEnvelope
    set?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    disconnect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    delete?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    update?: ReportUpdateWithWhereUniqueWithoutTransactionInput | ReportUpdateWithWhereUniqueWithoutTransactionInput[]
    updateMany?: ReportUpdateManyWithWhereWithoutTransactionInput | ReportUpdateManyWithWhereWithoutTransactionInput[]
    deleteMany?: ReportScalarWhereInput | ReportScalarWhereInput[]
  }

  export type TransactionCreateNestedManyWithoutPaymentInput = {
    create?: XOR<TransactionCreateWithoutPaymentInput, TransactionUncheckedCreateWithoutPaymentInput> | TransactionCreateWithoutPaymentInput[] | TransactionUncheckedCreateWithoutPaymentInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutPaymentInput | TransactionCreateOrConnectWithoutPaymentInput[]
    createMany?: TransactionCreateManyPaymentInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutPaymentInput = {
    create?: XOR<TransactionCreateWithoutPaymentInput, TransactionUncheckedCreateWithoutPaymentInput> | TransactionCreateWithoutPaymentInput[] | TransactionUncheckedCreateWithoutPaymentInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutPaymentInput | TransactionCreateOrConnectWithoutPaymentInput[]
    createMany?: TransactionCreateManyPaymentInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUpdateManyWithoutPaymentNestedInput = {
    create?: XOR<TransactionCreateWithoutPaymentInput, TransactionUncheckedCreateWithoutPaymentInput> | TransactionCreateWithoutPaymentInput[] | TransactionUncheckedCreateWithoutPaymentInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutPaymentInput | TransactionCreateOrConnectWithoutPaymentInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutPaymentInput | TransactionUpsertWithWhereUniqueWithoutPaymentInput[]
    createMany?: TransactionCreateManyPaymentInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutPaymentInput | TransactionUpdateWithWhereUniqueWithoutPaymentInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutPaymentInput | TransactionUpdateManyWithWhereWithoutPaymentInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutPaymentNestedInput = {
    create?: XOR<TransactionCreateWithoutPaymentInput, TransactionUncheckedCreateWithoutPaymentInput> | TransactionCreateWithoutPaymentInput[] | TransactionUncheckedCreateWithoutPaymentInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutPaymentInput | TransactionCreateOrConnectWithoutPaymentInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutPaymentInput | TransactionUpsertWithWhereUniqueWithoutPaymentInput[]
    createMany?: TransactionCreateManyPaymentInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutPaymentInput | TransactionUpdateWithWhereUniqueWithoutPaymentInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutPaymentInput | TransactionUpdateManyWithWhereWithoutPaymentInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionCreateNestedOneWithoutReportInput = {
    create?: XOR<TransactionCreateWithoutReportInput, TransactionUncheckedCreateWithoutReportInput>
    connectOrCreate?: TransactionCreateOrConnectWithoutReportInput
    connect?: TransactionWhereUniqueInput
  }

  export type TransactionUpdateOneRequiredWithoutReportNestedInput = {
    create?: XOR<TransactionCreateWithoutReportInput, TransactionUncheckedCreateWithoutReportInput>
    connectOrCreate?: TransactionCreateOrConnectWithoutReportInput
    upsert?: TransactionUpsertWithoutReportInput
    connect?: TransactionWhereUniqueInput
    update?: XOR<XOR<TransactionUpdateToOneWithWhereWithoutReportInput, TransactionUpdateWithoutReportInput>, TransactionUncheckedUpdateWithoutReportInput>
  }

  export type UserCreateNestedOneWithoutNotificationInput = {
    create?: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNotificationNestedInput = {
    create?: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationInput
    upsert?: UserUpsertWithoutNotificationInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationInput, UserUpdateWithoutNotificationInput>, UserUncheckedUpdateWithoutNotificationInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumStateFilter<$PrismaModel = never> = {
    equals?: $Enums.State | EnumStateFieldRefInput<$PrismaModel>
    in?: $Enums.State[]
    notIn?: $Enums.State[]
    not?: NestedEnumStateFilter<$PrismaModel> | $Enums.State
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.State | EnumStateFieldRefInput<$PrismaModel>
    in?: $Enums.State[]
    notIn?: $Enums.State[]
    not?: NestedEnumStateWithAggregatesFilter<$PrismaModel> | $Enums.State
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStateFilter<$PrismaModel>
    _max?: NestedEnumStateFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UserCreateWithoutCartsInput = {
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    updatedAt?: Date | string
    createdAt?: Date | string
    coupon?: CouponCreateNestedOneWithoutUserInput
    Comment?: CommentCreateNestedManyWithoutUserInput
    Shipping?: ShippingCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
    Notification?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCartsInput = {
    id?: number
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    couponCode?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    Comment?: CommentUncheckedCreateNestedManyWithoutUserInput
    Shipping?: ShippingUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCartsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCartsInput, UserUncheckedCreateWithoutCartsInput>
  }

  export type CartItemCreateWithoutCartInput = {
    totalprice?: number
    quantity: number
    createdAt?: Date | string
    updatedAt?: Date | string
    clothes: ClothesCreateNestedOneWithoutCartItemsInput
  }

  export type CartItemUncheckedCreateWithoutCartInput = {
    id?: number
    clothesId: number
    totalprice?: number
    quantity: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemCreateOrConnectWithoutCartInput = {
    where: CartItemWhereUniqueInput
    create: XOR<CartItemCreateWithoutCartInput, CartItemUncheckedCreateWithoutCartInput>
  }

  export type CartItemCreateManyCartInputEnvelope = {
    data: CartItemCreateManyCartInput | CartItemCreateManyCartInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCartsInput = {
    update: XOR<UserUpdateWithoutCartsInput, UserUncheckedUpdateWithoutCartsInput>
    create: XOR<UserCreateWithoutCartsInput, UserUncheckedCreateWithoutCartsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCartsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCartsInput, UserUncheckedUpdateWithoutCartsInput>
  }

  export type UserUpdateWithoutCartsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coupon?: CouponUpdateOneWithoutUserNestedInput
    Comment?: CommentUpdateManyWithoutUserNestedInput
    Shipping?: ShippingUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    Notification?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCartsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Comment?: CommentUncheckedUpdateManyWithoutUserNestedInput
    Shipping?: ShippingUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CartItemUpsertWithWhereUniqueWithoutCartInput = {
    where: CartItemWhereUniqueInput
    update: XOR<CartItemUpdateWithoutCartInput, CartItemUncheckedUpdateWithoutCartInput>
    create: XOR<CartItemCreateWithoutCartInput, CartItemUncheckedCreateWithoutCartInput>
  }

  export type CartItemUpdateWithWhereUniqueWithoutCartInput = {
    where: CartItemWhereUniqueInput
    data: XOR<CartItemUpdateWithoutCartInput, CartItemUncheckedUpdateWithoutCartInput>
  }

  export type CartItemUpdateManyWithWhereWithoutCartInput = {
    where: CartItemScalarWhereInput
    data: XOR<CartItemUpdateManyMutationInput, CartItemUncheckedUpdateManyWithoutCartInput>
  }

  export type CartItemScalarWhereInput = {
    AND?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
    OR?: CartItemScalarWhereInput[]
    NOT?: CartItemScalarWhereInput | CartItemScalarWhereInput[]
    id?: IntFilter<"CartItem"> | number
    cartId?: IntFilter<"CartItem"> | number
    clothesId?: IntFilter<"CartItem"> | number
    totalprice?: FloatFilter<"CartItem"> | number
    quantity?: IntFilter<"CartItem"> | number
    createdAt?: DateTimeFilter<"CartItem"> | Date | string
    updatedAt?: DateTimeFilter<"CartItem"> | Date | string
  }

  export type CartCreateWithoutUserInput = {
    state?: $Enums.State
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: CartItemCreateNestedManyWithoutCartInput
  }

  export type CartUncheckedCreateWithoutUserInput = {
    id?: number
    state?: $Enums.State
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: CartItemUncheckedCreateNestedManyWithoutCartInput
  }

  export type CartCreateOrConnectWithoutUserInput = {
    where: CartWhereUniqueInput
    create: XOR<CartCreateWithoutUserInput, CartUncheckedCreateWithoutUserInput>
  }

  export type CartCreateManyUserInputEnvelope = {
    data: CartCreateManyUserInput | CartCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CouponCreateWithoutUserInput = {
    code: string
    discount: number
    startDate?: Date | string
    endDate?: Date | string
    isActive?: boolean
    count: number
  }

  export type CouponUncheckedCreateWithoutUserInput = {
    id?: number
    code: string
    discount: number
    startDate?: Date | string
    endDate?: Date | string
    isActive?: boolean
    count: number
  }

  export type CouponCreateOrConnectWithoutUserInput = {
    where: CouponWhereUniqueInput
    create: XOR<CouponCreateWithoutUserInput, CouponUncheckedCreateWithoutUserInput>
  }

  export type CommentCreateWithoutUserInput = {
    content: string
    point: number
    clothes: ClothesCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateWithoutUserInput = {
    id?: number
    clothesId: number
    content: string
    point: number
  }

  export type CommentCreateOrConnectWithoutUserInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
  }

  export type CommentCreateManyUserInputEnvelope = {
    data: CommentCreateManyUserInput | CommentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ShippingCreateWithoutUserInput = {
    address: string
    state?: $Enums.State
    createdAt?: Date | string
    updatedAt?: Date | string
    transaction: TransactionCreateNestedOneWithoutShippingInput
  }

  export type ShippingUncheckedCreateWithoutUserInput = {
    id?: number
    address: string
    state?: $Enums.State
    transID: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShippingCreateOrConnectWithoutUserInput = {
    where: ShippingWhereUniqueInput
    create: XOR<ShippingCreateWithoutUserInput, ShippingUncheckedCreateWithoutUserInput>
  }

  export type ShippingCreateManyUserInputEnvelope = {
    data: ShippingCreateManyUserInput | ShippingCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutUserInput = {
    totalprice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    payment: PaymentCreateNestedOneWithoutTransactionInput
    Shipping?: ShippingCreateNestedManyWithoutTransactionInput
    Report?: ReportCreateNestedManyWithoutTransactionInput
  }

  export type TransactionUncheckedCreateWithoutUserInput = {
    id?: number
    totalprice: number
    PaymentId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    Shipping?: ShippingUncheckedCreateNestedManyWithoutTransactionInput
    Report?: ReportUncheckedCreateNestedManyWithoutTransactionInput
  }

  export type TransactionCreateOrConnectWithoutUserInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
  }

  export type TransactionCreateManyUserInputEnvelope = {
    data: TransactionCreateManyUserInput | TransactionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    content: string
    headline: string
    createdAt?: Date | string
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: number
    content: string
    headline: string
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CartUpsertWithWhereUniqueWithoutUserInput = {
    where: CartWhereUniqueInput
    update: XOR<CartUpdateWithoutUserInput, CartUncheckedUpdateWithoutUserInput>
    create: XOR<CartCreateWithoutUserInput, CartUncheckedCreateWithoutUserInput>
  }

  export type CartUpdateWithWhereUniqueWithoutUserInput = {
    where: CartWhereUniqueInput
    data: XOR<CartUpdateWithoutUserInput, CartUncheckedUpdateWithoutUserInput>
  }

  export type CartUpdateManyWithWhereWithoutUserInput = {
    where: CartScalarWhereInput
    data: XOR<CartUpdateManyMutationInput, CartUncheckedUpdateManyWithoutUserInput>
  }

  export type CartScalarWhereInput = {
    AND?: CartScalarWhereInput | CartScalarWhereInput[]
    OR?: CartScalarWhereInput[]
    NOT?: CartScalarWhereInput | CartScalarWhereInput[]
    id?: IntFilter<"Cart"> | number
    userId?: IntFilter<"Cart"> | number
    state?: EnumStateFilter<"Cart"> | $Enums.State
    createdAt?: DateTimeFilter<"Cart"> | Date | string
    updatedAt?: DateTimeFilter<"Cart"> | Date | string
  }

  export type CouponUpsertWithoutUserInput = {
    update: XOR<CouponUpdateWithoutUserInput, CouponUncheckedUpdateWithoutUserInput>
    create: XOR<CouponCreateWithoutUserInput, CouponUncheckedCreateWithoutUserInput>
    where?: CouponWhereInput
  }

  export type CouponUpdateToOneWithWhereWithoutUserInput = {
    where?: CouponWhereInput
    data: XOR<CouponUpdateWithoutUserInput, CouponUncheckedUpdateWithoutUserInput>
  }

  export type CouponUpdateWithoutUserInput = {
    code?: StringFieldUpdateOperationsInput | string
    discount?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    count?: IntFieldUpdateOperationsInput | number
  }

  export type CouponUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    discount?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    count?: IntFieldUpdateOperationsInput | number
  }

  export type CommentUpsertWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>
  }

  export type CommentUpdateManyWithWhereWithoutUserInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutUserInput>
  }

  export type CommentScalarWhereInput = {
    AND?: CommentScalarWhereInput | CommentScalarWhereInput[]
    OR?: CommentScalarWhereInput[]
    NOT?: CommentScalarWhereInput | CommentScalarWhereInput[]
    id?: IntFilter<"Comment"> | number
    userId?: IntFilter<"Comment"> | number
    clothesId?: IntFilter<"Comment"> | number
    content?: StringFilter<"Comment"> | string
    point?: IntFilter<"Comment"> | number
  }

  export type ShippingUpsertWithWhereUniqueWithoutUserInput = {
    where: ShippingWhereUniqueInput
    update: XOR<ShippingUpdateWithoutUserInput, ShippingUncheckedUpdateWithoutUserInput>
    create: XOR<ShippingCreateWithoutUserInput, ShippingUncheckedCreateWithoutUserInput>
  }

  export type ShippingUpdateWithWhereUniqueWithoutUserInput = {
    where: ShippingWhereUniqueInput
    data: XOR<ShippingUpdateWithoutUserInput, ShippingUncheckedUpdateWithoutUserInput>
  }

  export type ShippingUpdateManyWithWhereWithoutUserInput = {
    where: ShippingScalarWhereInput
    data: XOR<ShippingUpdateManyMutationInput, ShippingUncheckedUpdateManyWithoutUserInput>
  }

  export type ShippingScalarWhereInput = {
    AND?: ShippingScalarWhereInput | ShippingScalarWhereInput[]
    OR?: ShippingScalarWhereInput[]
    NOT?: ShippingScalarWhereInput | ShippingScalarWhereInput[]
    id?: IntFilter<"Shipping"> | number
    userId?: IntFilter<"Shipping"> | number
    address?: StringFilter<"Shipping"> | string
    state?: EnumStateFilter<"Shipping"> | $Enums.State
    transID?: IntFilter<"Shipping"> | number
    createdAt?: DateTimeFilter<"Shipping"> | Date | string
    updatedAt?: DateTimeFilter<"Shipping"> | Date | string
  }

  export type TransactionUpsertWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>
  }

  export type TransactionUpdateManyWithWhereWithoutUserInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutUserInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: IntFilter<"Transaction"> | number
    userId?: IntFilter<"Transaction"> | number
    totalprice?: FloatFilter<"Transaction"> | number
    PaymentId?: IntFilter<"Transaction"> | number
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: IntFilter<"Notification"> | number
    userId?: IntFilter<"Notification"> | number
    content?: StringFilter<"Notification"> | string
    headline?: StringFilter<"Notification"> | string
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type ClothesCreateWithoutCartItemsInput = {
    name: string
    description: string
    price: number
    count: number
    Color: string
    createdAt?: Date | string
    updatedAt?: Date | string
    mainImg?: ImageCreateNestedOneWithoutClothesMainInput
    Category?: CategoryCreateNestedManyWithoutClothesInput
    comments?: CommentCreateNestedManyWithoutClothesInput
  }

  export type ClothesUncheckedCreateWithoutCartItemsInput = {
    id?: number
    name: string
    description: string
    price: number
    count: number
    Color: string
    mainImgId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    Category?: CategoryUncheckedCreateNestedManyWithoutClothesInput
    comments?: CommentUncheckedCreateNestedManyWithoutClothesInput
  }

  export type ClothesCreateOrConnectWithoutCartItemsInput = {
    where: ClothesWhereUniqueInput
    create: XOR<ClothesCreateWithoutCartItemsInput, ClothesUncheckedCreateWithoutCartItemsInput>
  }

  export type CartCreateWithoutItemsInput = {
    state?: $Enums.State
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCartsInput
  }

  export type CartUncheckedCreateWithoutItemsInput = {
    id?: number
    userId: number
    state?: $Enums.State
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartCreateOrConnectWithoutItemsInput = {
    where: CartWhereUniqueInput
    create: XOR<CartCreateWithoutItemsInput, CartUncheckedCreateWithoutItemsInput>
  }

  export type ClothesUpsertWithoutCartItemsInput = {
    update: XOR<ClothesUpdateWithoutCartItemsInput, ClothesUncheckedUpdateWithoutCartItemsInput>
    create: XOR<ClothesCreateWithoutCartItemsInput, ClothesUncheckedCreateWithoutCartItemsInput>
    where?: ClothesWhereInput
  }

  export type ClothesUpdateToOneWithWhereWithoutCartItemsInput = {
    where?: ClothesWhereInput
    data: XOR<ClothesUpdateWithoutCartItemsInput, ClothesUncheckedUpdateWithoutCartItemsInput>
  }

  export type ClothesUpdateWithoutCartItemsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    count?: IntFieldUpdateOperationsInput | number
    Color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mainImg?: ImageUpdateOneWithoutClothesMainNestedInput
    Category?: CategoryUpdateManyWithoutClothesNestedInput
    comments?: CommentUpdateManyWithoutClothesNestedInput
  }

  export type ClothesUncheckedUpdateWithoutCartItemsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    count?: IntFieldUpdateOperationsInput | number
    Color?: StringFieldUpdateOperationsInput | string
    mainImgId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Category?: CategoryUncheckedUpdateManyWithoutClothesNestedInput
    comments?: CommentUncheckedUpdateManyWithoutClothesNestedInput
  }

  export type CartUpsertWithoutItemsInput = {
    update: XOR<CartUpdateWithoutItemsInput, CartUncheckedUpdateWithoutItemsInput>
    create: XOR<CartCreateWithoutItemsInput, CartUncheckedCreateWithoutItemsInput>
    where?: CartWhereInput
  }

  export type CartUpdateToOneWithWhereWithoutItemsInput = {
    where?: CartWhereInput
    data: XOR<CartUpdateWithoutItemsInput, CartUncheckedUpdateWithoutItemsInput>
  }

  export type CartUpdateWithoutItemsInput = {
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCartsNestedInput
  }

  export type CartUncheckedUpdateWithoutItemsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemCreateWithoutClothesInput = {
    totalprice?: number
    quantity: number
    createdAt?: Date | string
    updatedAt?: Date | string
    cart: CartCreateNestedOneWithoutItemsInput
  }

  export type CartItemUncheckedCreateWithoutClothesInput = {
    id?: number
    cartId: number
    totalprice?: number
    quantity: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemCreateOrConnectWithoutClothesInput = {
    where: CartItemWhereUniqueInput
    create: XOR<CartItemCreateWithoutClothesInput, CartItemUncheckedCreateWithoutClothesInput>
  }

  export type CartItemCreateManyClothesInputEnvelope = {
    data: CartItemCreateManyClothesInput | CartItemCreateManyClothesInput[]
    skipDuplicates?: boolean
  }

  export type ImageCreateWithoutClothesMainInput = {
    name: string
    url: string
  }

  export type ImageUncheckedCreateWithoutClothesMainInput = {
    id?: number
    name: string
    url: string
  }

  export type ImageCreateOrConnectWithoutClothesMainInput = {
    where: ImageWhereUniqueInput
    create: XOR<ImageCreateWithoutClothesMainInput, ImageUncheckedCreateWithoutClothesMainInput>
  }

  export type CategoryCreateWithoutClothesInput = {
    name: string
  }

  export type CategoryUncheckedCreateWithoutClothesInput = {
    id?: number
    name: string
  }

  export type CategoryCreateOrConnectWithoutClothesInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutClothesInput, CategoryUncheckedCreateWithoutClothesInput>
  }

  export type CategoryCreateManyClothesInputEnvelope = {
    data: CategoryCreateManyClothesInput | CategoryCreateManyClothesInput[]
    skipDuplicates?: boolean
  }

  export type CommentCreateWithoutClothesInput = {
    content: string
    point: number
    user: UserCreateNestedOneWithoutCommentInput
  }

  export type CommentUncheckedCreateWithoutClothesInput = {
    id?: number
    userId: number
    content: string
    point: number
  }

  export type CommentCreateOrConnectWithoutClothesInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutClothesInput, CommentUncheckedCreateWithoutClothesInput>
  }

  export type CommentCreateManyClothesInputEnvelope = {
    data: CommentCreateManyClothesInput | CommentCreateManyClothesInput[]
    skipDuplicates?: boolean
  }

  export type CartItemUpsertWithWhereUniqueWithoutClothesInput = {
    where: CartItemWhereUniqueInput
    update: XOR<CartItemUpdateWithoutClothesInput, CartItemUncheckedUpdateWithoutClothesInput>
    create: XOR<CartItemCreateWithoutClothesInput, CartItemUncheckedCreateWithoutClothesInput>
  }

  export type CartItemUpdateWithWhereUniqueWithoutClothesInput = {
    where: CartItemWhereUniqueInput
    data: XOR<CartItemUpdateWithoutClothesInput, CartItemUncheckedUpdateWithoutClothesInput>
  }

  export type CartItemUpdateManyWithWhereWithoutClothesInput = {
    where: CartItemScalarWhereInput
    data: XOR<CartItemUpdateManyMutationInput, CartItemUncheckedUpdateManyWithoutClothesInput>
  }

  export type ImageUpsertWithoutClothesMainInput = {
    update: XOR<ImageUpdateWithoutClothesMainInput, ImageUncheckedUpdateWithoutClothesMainInput>
    create: XOR<ImageCreateWithoutClothesMainInput, ImageUncheckedCreateWithoutClothesMainInput>
    where?: ImageWhereInput
  }

  export type ImageUpdateToOneWithWhereWithoutClothesMainInput = {
    where?: ImageWhereInput
    data: XOR<ImageUpdateWithoutClothesMainInput, ImageUncheckedUpdateWithoutClothesMainInput>
  }

  export type ImageUpdateWithoutClothesMainInput = {
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
  }

  export type ImageUncheckedUpdateWithoutClothesMainInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
  }

  export type CategoryUpsertWithWhereUniqueWithoutClothesInput = {
    where: CategoryWhereUniqueInput
    update: XOR<CategoryUpdateWithoutClothesInput, CategoryUncheckedUpdateWithoutClothesInput>
    create: XOR<CategoryCreateWithoutClothesInput, CategoryUncheckedCreateWithoutClothesInput>
  }

  export type CategoryUpdateWithWhereUniqueWithoutClothesInput = {
    where: CategoryWhereUniqueInput
    data: XOR<CategoryUpdateWithoutClothesInput, CategoryUncheckedUpdateWithoutClothesInput>
  }

  export type CategoryUpdateManyWithWhereWithoutClothesInput = {
    where: CategoryScalarWhereInput
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyWithoutClothesInput>
  }

  export type CategoryScalarWhereInput = {
    AND?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
    OR?: CategoryScalarWhereInput[]
    NOT?: CategoryScalarWhereInput | CategoryScalarWhereInput[]
    id?: IntFilter<"Category"> | number
    Clothes_id?: IntFilter<"Category"> | number
    name?: StringFilter<"Category"> | string
  }

  export type CommentUpsertWithWhereUniqueWithoutClothesInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutClothesInput, CommentUncheckedUpdateWithoutClothesInput>
    create: XOR<CommentCreateWithoutClothesInput, CommentUncheckedCreateWithoutClothesInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutClothesInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutClothesInput, CommentUncheckedUpdateWithoutClothesInput>
  }

  export type CommentUpdateManyWithWhereWithoutClothesInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutClothesInput>
  }

  export type ClothesCreateWithoutCategoryInput = {
    name: string
    description: string
    price: number
    count: number
    Color: string
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemCreateNestedManyWithoutClothesInput
    mainImg?: ImageCreateNestedOneWithoutClothesMainInput
    comments?: CommentCreateNestedManyWithoutClothesInput
  }

  export type ClothesUncheckedCreateWithoutCategoryInput = {
    id?: number
    name: string
    description: string
    price: number
    count: number
    Color: string
    mainImgId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemUncheckedCreateNestedManyWithoutClothesInput
    comments?: CommentUncheckedCreateNestedManyWithoutClothesInput
  }

  export type ClothesCreateOrConnectWithoutCategoryInput = {
    where: ClothesWhereUniqueInput
    create: XOR<ClothesCreateWithoutCategoryInput, ClothesUncheckedCreateWithoutCategoryInput>
  }

  export type ClothesUpsertWithoutCategoryInput = {
    update: XOR<ClothesUpdateWithoutCategoryInput, ClothesUncheckedUpdateWithoutCategoryInput>
    create: XOR<ClothesCreateWithoutCategoryInput, ClothesUncheckedCreateWithoutCategoryInput>
    where?: ClothesWhereInput
  }

  export type ClothesUpdateToOneWithWhereWithoutCategoryInput = {
    where?: ClothesWhereInput
    data: XOR<ClothesUpdateWithoutCategoryInput, ClothesUncheckedUpdateWithoutCategoryInput>
  }

  export type ClothesUpdateWithoutCategoryInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    count?: IntFieldUpdateOperationsInput | number
    Color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUpdateManyWithoutClothesNestedInput
    mainImg?: ImageUpdateOneWithoutClothesMainNestedInput
    comments?: CommentUpdateManyWithoutClothesNestedInput
  }

  export type ClothesUncheckedUpdateWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    count?: IntFieldUpdateOperationsInput | number
    Color?: StringFieldUpdateOperationsInput | string
    mainImgId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUncheckedUpdateManyWithoutClothesNestedInput
    comments?: CommentUncheckedUpdateManyWithoutClothesNestedInput
  }

  export type ClothesCreateWithoutMainImgInput = {
    name: string
    description: string
    price: number
    count: number
    Color: string
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemCreateNestedManyWithoutClothesInput
    Category?: CategoryCreateNestedManyWithoutClothesInput
    comments?: CommentCreateNestedManyWithoutClothesInput
  }

  export type ClothesUncheckedCreateWithoutMainImgInput = {
    id?: number
    name: string
    description: string
    price: number
    count: number
    Color: string
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemUncheckedCreateNestedManyWithoutClothesInput
    Category?: CategoryUncheckedCreateNestedManyWithoutClothesInput
    comments?: CommentUncheckedCreateNestedManyWithoutClothesInput
  }

  export type ClothesCreateOrConnectWithoutMainImgInput = {
    where: ClothesWhereUniqueInput
    create: XOR<ClothesCreateWithoutMainImgInput, ClothesUncheckedCreateWithoutMainImgInput>
  }

  export type ClothesUpsertWithoutMainImgInput = {
    update: XOR<ClothesUpdateWithoutMainImgInput, ClothesUncheckedUpdateWithoutMainImgInput>
    create: XOR<ClothesCreateWithoutMainImgInput, ClothesUncheckedCreateWithoutMainImgInput>
    where?: ClothesWhereInput
  }

  export type ClothesUpdateToOneWithWhereWithoutMainImgInput = {
    where?: ClothesWhereInput
    data: XOR<ClothesUpdateWithoutMainImgInput, ClothesUncheckedUpdateWithoutMainImgInput>
  }

  export type ClothesUpdateWithoutMainImgInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    count?: IntFieldUpdateOperationsInput | number
    Color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUpdateManyWithoutClothesNestedInput
    Category?: CategoryUpdateManyWithoutClothesNestedInput
    comments?: CommentUpdateManyWithoutClothesNestedInput
  }

  export type ClothesUncheckedUpdateWithoutMainImgInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    count?: IntFieldUpdateOperationsInput | number
    Color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUncheckedUpdateManyWithoutClothesNestedInput
    Category?: CategoryUncheckedUpdateManyWithoutClothesNestedInput
    comments?: CommentUncheckedUpdateManyWithoutClothesNestedInput
  }

  export type UserCreateWithoutCommentInput = {
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    updatedAt?: Date | string
    createdAt?: Date | string
    carts?: CartCreateNestedManyWithoutUserInput
    coupon?: CouponCreateNestedOneWithoutUserInput
    Shipping?: ShippingCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
    Notification?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCommentInput = {
    id?: number
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    couponCode?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    carts?: CartUncheckedCreateNestedManyWithoutUserInput
    Shipping?: ShippingUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCommentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCommentInput, UserUncheckedCreateWithoutCommentInput>
  }

  export type ClothesCreateWithoutCommentsInput = {
    name: string
    description: string
    price: number
    count: number
    Color: string
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemCreateNestedManyWithoutClothesInput
    mainImg?: ImageCreateNestedOneWithoutClothesMainInput
    Category?: CategoryCreateNestedManyWithoutClothesInput
  }

  export type ClothesUncheckedCreateWithoutCommentsInput = {
    id?: number
    name: string
    description: string
    price: number
    count: number
    Color: string
    mainImgId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cartItems?: CartItemUncheckedCreateNestedManyWithoutClothesInput
    Category?: CategoryUncheckedCreateNestedManyWithoutClothesInput
  }

  export type ClothesCreateOrConnectWithoutCommentsInput = {
    where: ClothesWhereUniqueInput
    create: XOR<ClothesCreateWithoutCommentsInput, ClothesUncheckedCreateWithoutCommentsInput>
  }

  export type UserUpsertWithoutCommentInput = {
    update: XOR<UserUpdateWithoutCommentInput, UserUncheckedUpdateWithoutCommentInput>
    create: XOR<UserCreateWithoutCommentInput, UserUncheckedCreateWithoutCommentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCommentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCommentInput, UserUncheckedUpdateWithoutCommentInput>
  }

  export type UserUpdateWithoutCommentInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carts?: CartUpdateManyWithoutUserNestedInput
    coupon?: CouponUpdateOneWithoutUserNestedInput
    Shipping?: ShippingUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    Notification?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCommentInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carts?: CartUncheckedUpdateManyWithoutUserNestedInput
    Shipping?: ShippingUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ClothesUpsertWithoutCommentsInput = {
    update: XOR<ClothesUpdateWithoutCommentsInput, ClothesUncheckedUpdateWithoutCommentsInput>
    create: XOR<ClothesCreateWithoutCommentsInput, ClothesUncheckedCreateWithoutCommentsInput>
    where?: ClothesWhereInput
  }

  export type ClothesUpdateToOneWithWhereWithoutCommentsInput = {
    where?: ClothesWhereInput
    data: XOR<ClothesUpdateWithoutCommentsInput, ClothesUncheckedUpdateWithoutCommentsInput>
  }

  export type ClothesUpdateWithoutCommentsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    count?: IntFieldUpdateOperationsInput | number
    Color?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUpdateManyWithoutClothesNestedInput
    mainImg?: ImageUpdateOneWithoutClothesMainNestedInput
    Category?: CategoryUpdateManyWithoutClothesNestedInput
  }

  export type ClothesUncheckedUpdateWithoutCommentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    price?: FloatFieldUpdateOperationsInput | number
    count?: IntFieldUpdateOperationsInput | number
    Color?: StringFieldUpdateOperationsInput | string
    mainImgId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cartItems?: CartItemUncheckedUpdateManyWithoutClothesNestedInput
    Category?: CategoryUncheckedUpdateManyWithoutClothesNestedInput
  }

  export type UserCreateWithoutCouponInput = {
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    updatedAt?: Date | string
    createdAt?: Date | string
    carts?: CartCreateNestedManyWithoutUserInput
    Comment?: CommentCreateNestedManyWithoutUserInput
    Shipping?: ShippingCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
    Notification?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCouponInput = {
    id?: number
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    updatedAt?: Date | string
    createdAt?: Date | string
    carts?: CartUncheckedCreateNestedManyWithoutUserInput
    Comment?: CommentUncheckedCreateNestedManyWithoutUserInput
    Shipping?: ShippingUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCouponInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCouponInput, UserUncheckedCreateWithoutCouponInput>
  }

  export type UserCreateManyCouponInputEnvelope = {
    data: UserCreateManyCouponInput | UserCreateManyCouponInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutCouponInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutCouponInput, UserUncheckedUpdateWithoutCouponInput>
    create: XOR<UserCreateWithoutCouponInput, UserUncheckedCreateWithoutCouponInput>
  }

  export type UserUpdateWithWhereUniqueWithoutCouponInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutCouponInput, UserUncheckedUpdateWithoutCouponInput>
  }

  export type UserUpdateManyWithWhereWithoutCouponInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutCouponInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: IntFilter<"User"> | number
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    address?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    couponCode?: StringNullableFilter<"User"> | string | null
    updatedAt?: DateTimeFilter<"User"> | Date | string
    createdAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserCreateWithoutShippingInput = {
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    updatedAt?: Date | string
    createdAt?: Date | string
    carts?: CartCreateNestedManyWithoutUserInput
    coupon?: CouponCreateNestedOneWithoutUserInput
    Comment?: CommentCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
    Notification?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutShippingInput = {
    id?: number
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    couponCode?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    carts?: CartUncheckedCreateNestedManyWithoutUserInput
    Comment?: CommentUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutShippingInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutShippingInput, UserUncheckedCreateWithoutShippingInput>
  }

  export type TransactionCreateWithoutShippingInput = {
    totalprice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTransactionsInput
    payment: PaymentCreateNestedOneWithoutTransactionInput
    Report?: ReportCreateNestedManyWithoutTransactionInput
  }

  export type TransactionUncheckedCreateWithoutShippingInput = {
    id?: number
    userId: number
    totalprice: number
    PaymentId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    Report?: ReportUncheckedCreateNestedManyWithoutTransactionInput
  }

  export type TransactionCreateOrConnectWithoutShippingInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutShippingInput, TransactionUncheckedCreateWithoutShippingInput>
  }

  export type UserUpsertWithoutShippingInput = {
    update: XOR<UserUpdateWithoutShippingInput, UserUncheckedUpdateWithoutShippingInput>
    create: XOR<UserCreateWithoutShippingInput, UserUncheckedCreateWithoutShippingInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutShippingInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutShippingInput, UserUncheckedUpdateWithoutShippingInput>
  }

  export type UserUpdateWithoutShippingInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carts?: CartUpdateManyWithoutUserNestedInput
    coupon?: CouponUpdateOneWithoutUserNestedInput
    Comment?: CommentUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    Notification?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutShippingInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carts?: CartUncheckedUpdateManyWithoutUserNestedInput
    Comment?: CommentUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TransactionUpsertWithoutShippingInput = {
    update: XOR<TransactionUpdateWithoutShippingInput, TransactionUncheckedUpdateWithoutShippingInput>
    create: XOR<TransactionCreateWithoutShippingInput, TransactionUncheckedCreateWithoutShippingInput>
    where?: TransactionWhereInput
  }

  export type TransactionUpdateToOneWithWhereWithoutShippingInput = {
    where?: TransactionWhereInput
    data: XOR<TransactionUpdateWithoutShippingInput, TransactionUncheckedUpdateWithoutShippingInput>
  }

  export type TransactionUpdateWithoutShippingInput = {
    totalprice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput
    payment?: PaymentUpdateOneRequiredWithoutTransactionNestedInput
    Report?: ReportUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutShippingInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    PaymentId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Report?: ReportUncheckedUpdateManyWithoutTransactionNestedInput
  }

  export type UserCreateWithoutTransactionsInput = {
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    updatedAt?: Date | string
    createdAt?: Date | string
    carts?: CartCreateNestedManyWithoutUserInput
    coupon?: CouponCreateNestedOneWithoutUserInput
    Comment?: CommentCreateNestedManyWithoutUserInput
    Shipping?: ShippingCreateNestedManyWithoutUserInput
    Notification?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTransactionsInput = {
    id?: number
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    couponCode?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    carts?: CartUncheckedCreateNestedManyWithoutUserInput
    Comment?: CommentUncheckedCreateNestedManyWithoutUserInput
    Shipping?: ShippingUncheckedCreateNestedManyWithoutUserInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTransactionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
  }

  export type PaymentCreateWithoutTransactionInput = {
    fee: number
    method: string
  }

  export type PaymentUncheckedCreateWithoutTransactionInput = {
    id?: number
    fee: number
    method: string
  }

  export type PaymentCreateOrConnectWithoutTransactionInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutTransactionInput, PaymentUncheckedCreateWithoutTransactionInput>
  }

  export type ShippingCreateWithoutTransactionInput = {
    address: string
    state?: $Enums.State
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutShippingInput
  }

  export type ShippingUncheckedCreateWithoutTransactionInput = {
    id?: number
    userId: number
    address: string
    state?: $Enums.State
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShippingCreateOrConnectWithoutTransactionInput = {
    where: ShippingWhereUniqueInput
    create: XOR<ShippingCreateWithoutTransactionInput, ShippingUncheckedCreateWithoutTransactionInput>
  }

  export type ShippingCreateManyTransactionInputEnvelope = {
    data: ShippingCreateManyTransactionInput | ShippingCreateManyTransactionInput[]
    skipDuplicates?: boolean
  }

  export type ReportCreateWithoutTransactionInput = {
    createdAt?: Date | string
    revenue: number
    fee: number
  }

  export type ReportUncheckedCreateWithoutTransactionInput = {
    createdAt?: Date | string
    revenue: number
    fee: number
  }

  export type ReportCreateOrConnectWithoutTransactionInput = {
    where: ReportWhereUniqueInput
    create: XOR<ReportCreateWithoutTransactionInput, ReportUncheckedCreateWithoutTransactionInput>
  }

  export type ReportCreateManyTransactionInputEnvelope = {
    data: ReportCreateManyTransactionInput | ReportCreateManyTransactionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutTransactionsInput = {
    update: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>
  }

  export type UserUpdateWithoutTransactionsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carts?: CartUpdateManyWithoutUserNestedInput
    coupon?: CouponUpdateOneWithoutUserNestedInput
    Comment?: CommentUpdateManyWithoutUserNestedInput
    Shipping?: ShippingUpdateManyWithoutUserNestedInput
    Notification?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carts?: CartUncheckedUpdateManyWithoutUserNestedInput
    Comment?: CommentUncheckedUpdateManyWithoutUserNestedInput
    Shipping?: ShippingUncheckedUpdateManyWithoutUserNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PaymentUpsertWithoutTransactionInput = {
    update: XOR<PaymentUpdateWithoutTransactionInput, PaymentUncheckedUpdateWithoutTransactionInput>
    create: XOR<PaymentCreateWithoutTransactionInput, PaymentUncheckedCreateWithoutTransactionInput>
    where?: PaymentWhereInput
  }

  export type PaymentUpdateToOneWithWhereWithoutTransactionInput = {
    where?: PaymentWhereInput
    data: XOR<PaymentUpdateWithoutTransactionInput, PaymentUncheckedUpdateWithoutTransactionInput>
  }

  export type PaymentUpdateWithoutTransactionInput = {
    fee?: FloatFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
  }

  export type PaymentUncheckedUpdateWithoutTransactionInput = {
    id?: IntFieldUpdateOperationsInput | number
    fee?: FloatFieldUpdateOperationsInput | number
    method?: StringFieldUpdateOperationsInput | string
  }

  export type ShippingUpsertWithWhereUniqueWithoutTransactionInput = {
    where: ShippingWhereUniqueInput
    update: XOR<ShippingUpdateWithoutTransactionInput, ShippingUncheckedUpdateWithoutTransactionInput>
    create: XOR<ShippingCreateWithoutTransactionInput, ShippingUncheckedCreateWithoutTransactionInput>
  }

  export type ShippingUpdateWithWhereUniqueWithoutTransactionInput = {
    where: ShippingWhereUniqueInput
    data: XOR<ShippingUpdateWithoutTransactionInput, ShippingUncheckedUpdateWithoutTransactionInput>
  }

  export type ShippingUpdateManyWithWhereWithoutTransactionInput = {
    where: ShippingScalarWhereInput
    data: XOR<ShippingUpdateManyMutationInput, ShippingUncheckedUpdateManyWithoutTransactionInput>
  }

  export type ReportUpsertWithWhereUniqueWithoutTransactionInput = {
    where: ReportWhereUniqueInput
    update: XOR<ReportUpdateWithoutTransactionInput, ReportUncheckedUpdateWithoutTransactionInput>
    create: XOR<ReportCreateWithoutTransactionInput, ReportUncheckedCreateWithoutTransactionInput>
  }

  export type ReportUpdateWithWhereUniqueWithoutTransactionInput = {
    where: ReportWhereUniqueInput
    data: XOR<ReportUpdateWithoutTransactionInput, ReportUncheckedUpdateWithoutTransactionInput>
  }

  export type ReportUpdateManyWithWhereWithoutTransactionInput = {
    where: ReportScalarWhereInput
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyWithoutTransactionInput>
  }

  export type ReportScalarWhereInput = {
    AND?: ReportScalarWhereInput | ReportScalarWhereInput[]
    OR?: ReportScalarWhereInput[]
    NOT?: ReportScalarWhereInput | ReportScalarWhereInput[]
    createdAt?: DateTimeFilter<"Report"> | Date | string
    revenue?: FloatFilter<"Report"> | number
    fee?: FloatFilter<"Report"> | number
    transactionsId?: IntFilter<"Report"> | number
  }

  export type TransactionCreateWithoutPaymentInput = {
    totalprice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTransactionsInput
    Shipping?: ShippingCreateNestedManyWithoutTransactionInput
    Report?: ReportCreateNestedManyWithoutTransactionInput
  }

  export type TransactionUncheckedCreateWithoutPaymentInput = {
    id?: number
    userId: number
    totalprice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    Shipping?: ShippingUncheckedCreateNestedManyWithoutTransactionInput
    Report?: ReportUncheckedCreateNestedManyWithoutTransactionInput
  }

  export type TransactionCreateOrConnectWithoutPaymentInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutPaymentInput, TransactionUncheckedCreateWithoutPaymentInput>
  }

  export type TransactionCreateManyPaymentInputEnvelope = {
    data: TransactionCreateManyPaymentInput | TransactionCreateManyPaymentInput[]
    skipDuplicates?: boolean
  }

  export type TransactionUpsertWithWhereUniqueWithoutPaymentInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutPaymentInput, TransactionUncheckedUpdateWithoutPaymentInput>
    create: XOR<TransactionCreateWithoutPaymentInput, TransactionUncheckedCreateWithoutPaymentInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutPaymentInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutPaymentInput, TransactionUncheckedUpdateWithoutPaymentInput>
  }

  export type TransactionUpdateManyWithWhereWithoutPaymentInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutPaymentInput>
  }

  export type TransactionCreateWithoutReportInput = {
    totalprice: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTransactionsInput
    payment: PaymentCreateNestedOneWithoutTransactionInput
    Shipping?: ShippingCreateNestedManyWithoutTransactionInput
  }

  export type TransactionUncheckedCreateWithoutReportInput = {
    id?: number
    userId: number
    totalprice: number
    PaymentId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    Shipping?: ShippingUncheckedCreateNestedManyWithoutTransactionInput
  }

  export type TransactionCreateOrConnectWithoutReportInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutReportInput, TransactionUncheckedCreateWithoutReportInput>
  }

  export type TransactionUpsertWithoutReportInput = {
    update: XOR<TransactionUpdateWithoutReportInput, TransactionUncheckedUpdateWithoutReportInput>
    create: XOR<TransactionCreateWithoutReportInput, TransactionUncheckedCreateWithoutReportInput>
    where?: TransactionWhereInput
  }

  export type TransactionUpdateToOneWithWhereWithoutReportInput = {
    where?: TransactionWhereInput
    data: XOR<TransactionUpdateWithoutReportInput, TransactionUncheckedUpdateWithoutReportInput>
  }

  export type TransactionUpdateWithoutReportInput = {
    totalprice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput
    payment?: PaymentUpdateOneRequiredWithoutTransactionNestedInput
    Shipping?: ShippingUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutReportInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    PaymentId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Shipping?: ShippingUncheckedUpdateManyWithoutTransactionNestedInput
  }

  export type UserCreateWithoutNotificationInput = {
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    updatedAt?: Date | string
    createdAt?: Date | string
    carts?: CartCreateNestedManyWithoutUserInput
    coupon?: CouponCreateNestedOneWithoutUserInput
    Comment?: CommentCreateNestedManyWithoutUserInput
    Shipping?: ShippingCreateNestedManyWithoutUserInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationInput = {
    id?: number
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    couponCode?: string | null
    updatedAt?: Date | string
    createdAt?: Date | string
    carts?: CartUncheckedCreateNestedManyWithoutUserInput
    Comment?: CommentUncheckedCreateNestedManyWithoutUserInput
    Shipping?: ShippingUncheckedCreateNestedManyWithoutUserInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
  }

  export type UserUpsertWithoutNotificationInput = {
    update: XOR<UserUpdateWithoutNotificationInput, UserUncheckedUpdateWithoutNotificationInput>
    create: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationInput, UserUncheckedUpdateWithoutNotificationInput>
  }

  export type UserUpdateWithoutNotificationInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carts?: CartUpdateManyWithoutUserNestedInput
    coupon?: CouponUpdateOneWithoutUserNestedInput
    Comment?: CommentUpdateManyWithoutUserNestedInput
    Shipping?: ShippingUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    couponCode?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carts?: CartUncheckedUpdateManyWithoutUserNestedInput
    Comment?: CommentUncheckedUpdateManyWithoutUserNestedInput
    Shipping?: ShippingUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CartItemCreateManyCartInput = {
    id?: number
    clothesId: number
    totalprice?: number
    quantity: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CartItemUpdateWithoutCartInput = {
    totalprice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clothes?: ClothesUpdateOneRequiredWithoutCartItemsNestedInput
  }

  export type CartItemUncheckedUpdateWithoutCartInput = {
    id?: IntFieldUpdateOperationsInput | number
    clothesId?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUncheckedUpdateManyWithoutCartInput = {
    id?: IntFieldUpdateOperationsInput | number
    clothesId?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartCreateManyUserInput = {
    id?: number
    state?: $Enums.State
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommentCreateManyUserInput = {
    id?: number
    clothesId: number
    content: string
    point: number
  }

  export type ShippingCreateManyUserInput = {
    id?: number
    address: string
    state?: $Enums.State
    transID: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateManyUserInput = {
    id?: number
    totalprice: number
    PaymentId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: number
    content: string
    headline: string
    createdAt?: Date | string
  }

  export type CartUpdateWithoutUserInput = {
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: CartItemUpdateManyWithoutCartNestedInput
  }

  export type CartUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: CartItemUncheckedUpdateManyWithoutCartNestedInput
  }

  export type CartUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUpdateWithoutUserInput = {
    content?: StringFieldUpdateOperationsInput | string
    point?: IntFieldUpdateOperationsInput | number
    clothes?: ClothesUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    clothesId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    point?: IntFieldUpdateOperationsInput | number
  }

  export type CommentUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    clothesId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    point?: IntFieldUpdateOperationsInput | number
  }

  export type ShippingUpdateWithoutUserInput = {
    address?: StringFieldUpdateOperationsInput | string
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transaction?: TransactionUpdateOneRequiredWithoutShippingNestedInput
  }

  export type ShippingUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    transID?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShippingUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    transID?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUpdateWithoutUserInput = {
    totalprice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payment?: PaymentUpdateOneRequiredWithoutTransactionNestedInput
    Shipping?: ShippingUpdateManyWithoutTransactionNestedInput
    Report?: ReportUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    PaymentId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Shipping?: ShippingUncheckedUpdateManyWithoutTransactionNestedInput
    Report?: ReportUncheckedUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    PaymentId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    content?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemCreateManyClothesInput = {
    id?: number
    cartId: number
    totalprice?: number
    quantity: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryCreateManyClothesInput = {
    id?: number
    name: string
  }

  export type CommentCreateManyClothesInput = {
    id?: number
    userId: number
    content: string
    point: number
  }

  export type CartItemUpdateWithoutClothesInput = {
    totalprice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cart?: CartUpdateOneRequiredWithoutItemsNestedInput
  }

  export type CartItemUncheckedUpdateWithoutClothesInput = {
    id?: IntFieldUpdateOperationsInput | number
    cartId?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CartItemUncheckedUpdateManyWithoutClothesInput = {
    id?: IntFieldUpdateOperationsInput | number
    cartId?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUpdateWithoutClothesInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type CategoryUncheckedUpdateWithoutClothesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type CategoryUncheckedUpdateManyWithoutClothesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type CommentUpdateWithoutClothesInput = {
    content?: StringFieldUpdateOperationsInput | string
    point?: IntFieldUpdateOperationsInput | number
    user?: UserUpdateOneRequiredWithoutCommentNestedInput
  }

  export type CommentUncheckedUpdateWithoutClothesInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    point?: IntFieldUpdateOperationsInput | number
  }

  export type CommentUncheckedUpdateManyWithoutClothesInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    point?: IntFieldUpdateOperationsInput | number
  }

  export type UserCreateManyCouponInput = {
    id?: number
    name: string
    email: string
    password: string
    phone: string
    address: string
    role?: $Enums.Role
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type UserUpdateWithoutCouponInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carts?: CartUpdateManyWithoutUserNestedInput
    Comment?: CommentUpdateManyWithoutUserNestedInput
    Shipping?: ShippingUpdateManyWithoutUserNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
    Notification?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCouponInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    carts?: CartUncheckedUpdateManyWithoutUserNestedInput
    Comment?: CommentUncheckedUpdateManyWithoutUserNestedInput
    Shipping?: ShippingUncheckedUpdateManyWithoutUserNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutCouponInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShippingCreateManyTransactionInput = {
    id?: number
    userId: number
    address: string
    state?: $Enums.State
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReportCreateManyTransactionInput = {
    createdAt?: Date | string
    revenue: number
    fee: number
  }

  export type ShippingUpdateWithoutTransactionInput = {
    address?: StringFieldUpdateOperationsInput | string
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutShippingNestedInput
  }

  export type ShippingUncheckedUpdateWithoutTransactionInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShippingUncheckedUpdateManyWithoutTransactionInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    state?: EnumStateFieldUpdateOperationsInput | $Enums.State
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUpdateWithoutTransactionInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revenue?: FloatFieldUpdateOperationsInput | number
    fee?: FloatFieldUpdateOperationsInput | number
  }

  export type ReportUncheckedUpdateWithoutTransactionInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revenue?: FloatFieldUpdateOperationsInput | number
    fee?: FloatFieldUpdateOperationsInput | number
  }

  export type ReportUncheckedUpdateManyWithoutTransactionInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revenue?: FloatFieldUpdateOperationsInput | number
    fee?: FloatFieldUpdateOperationsInput | number
  }

  export type TransactionCreateManyPaymentInput = {
    id?: number
    userId: number
    totalprice: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateWithoutPaymentInput = {
    totalprice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTransactionsNestedInput
    Shipping?: ShippingUpdateManyWithoutTransactionNestedInput
    Report?: ReportUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutPaymentInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    Shipping?: ShippingUncheckedUpdateManyWithoutTransactionNestedInput
    Report?: ReportUncheckedUpdateManyWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateManyWithoutPaymentInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    totalprice?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}

/**
 * Copyright (c) 2026 Hachiko Team from IFSC Xanxerê. All rights reserved.
 * 
 * This code was reased under the Creative Commons Zero v1.0 Universal license.
 * 
 * @autor Pagani
 */

import { IAsyncDisposable } from "@rapid-d-kit/disposable";
import { Client, Pool, type PoolClient, type QueryResult } from "pg";


export type QueryExecOptions = {
  values?: unknown[];
  transaction?: PoolClient;
};


/** Class that abstracts the application database */
export class Database implements IAsyncDisposable {
  static #Ins: Database | null = null;

  /** Returns the singleton instance of this object */
  public static getInstance(): Database {
    if(Database.#Ins == null) {
      Database.#Ins = new Database();
    }

    return Database.#Ins;
  }

  /** Execute a query statically without pooling resources. Argument `transaction` is ignored here */
  public static async exec(query: string, options?: QueryExecOptions): Promise<QueryResult> {
    if(!process.env.POSTGRES_URL) {
      throw new Error("No POSTGRES_URL found in current environment. AND FIX THIS ERROR OBJECT");
    }

    const conn = new Client({ // TODO: review these connection properties
      connectionString: process.env.POSTGRES_URL,
      connectionTimeoutMillis: 20000,
    });

    conn.connect();

    try {
      return await conn.query({ text: query, values: options?.values });
    } finally {
      await conn.end();
    }
  }

  private _disposed: boolean;
  private _pool: Pool;

  protected constructor() {
    if(!process.env.POSTGRES_URL) {
      throw new Error("No POSTGRES_URL found in current environment. AND FIX THIS ERROR OBJECT");
    }

    this._pool = new Pool({ // TODO: review these connection properties
      connectionString: process.env.POSTGRES_URL,
      connectionTimeoutMillis: 20000,
      allowExitOnIdle: true,
    });
  }

  /** 
   * Executes a query from pool of connections or given client.
   */
  public async exec(query: string, options?: QueryExecOptions): Promise<QueryResult> {
    if(this._disposed) {
      throw new Error("Database disposed. AND FIX THIS ERROR OBJECT");
    }

    const client = options?.transaction ?? await this._pool.connect();

    try {
      return await client.query({ text: query, values: options?.values });
    } finally {
      if(client && !options?.transaction) {
        client.release();
      }
    }
  }

  /** Closes the connections pool and destruct current instance of `Database` */
  public async dispose(): Promise<void> {
    if(!this._disposed) {
      this._disposed = true;
      await this._pool.end();
    }
  }
}

'use client'

import { BaseData } from "@/core/classes/base-data";

export class Person extends BaseData {
    // @Key
    id: string | undefined;
    firstName?: string;
    lastName?: string;
    age?: number;
    visits?: number;
    status?: string;
    progress?: number;
    date?: Date;
    active?: boolean;
}


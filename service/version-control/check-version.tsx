import { SQLiteDatabase } from "expo-sqlite";
import { database } from "../database";
import { CURRENT_DB_VERSION, HISTORY_CARD_DB_VERSIONS, HISTORY_BANK_DB_VERSIONS } from "./version";

export enum emDBType {
    BANK_DB,
    CARD_DB 
}
const versionMap : Map<emDBType, number[]> = new Map<emDBType, number[]>();
versionMap[emDBType.BANK_DB] = HISTORY_BANK_DB_VERSIONS;
versionMap[emDBType.CARD_DB] = HISTORY_CARD_DB_VERSIONS;

export function getExistDbVersion(dbType: emDBType): number{
    let existDBVer = 0.0;
    // find correspond versions
    let versions = versionMap[dbType];
    for (let index = 0; index < versions.length; index++) {
        let dbVer = versions[index];
        if(!database.tryGetBankVersion(dbVer)){
            existDBVer = versions[index-1];
            break;
        }
    }
    return existDBVer;
}



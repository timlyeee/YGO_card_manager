import { database } from "./database";
import { getExistDbVersion, emDBType } from "./version-control/check-version";
import { CURRENT_DB_VERSION, HISTORY_DB_VERSION, HISTORY_BANK_DB_VERSIONS } from "./version-control/version";

function initApp() {
    let existCardDBVersion = getExistDbVersion(emDBType.BANK_DB);
    if (existCardDBVersion != CURRENT_DB_VERSION) {
        // TODO: ask to update, default update here
        var startVersionIdx: number = HISTORY_BANK_DB_VERSIONS.findIndex((version) => version == existCardDBVersion)
        for(var idx = 0l)
    }
}
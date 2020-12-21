import { isNone, TMap } from "../../util/util";
import { Sector } from "../../webapi";
import { Config } from "../../widget";

/**
 * Get the selected sectors for the IO grid in a map of `sector-code : share`
 * pairs.
 */
export function fromConfig(config: Config, sectors: Sector[]): TMap<number> {
    const s: TMap<number> = {};
    if (!config) {
        return s;
    }

    // collect the sectors shares and disabled sectors from 
    const disabled: string[] = [];
    if (config.sectors) {
        for (const code of config.sectors) {
            const parts = code.split(":");
            if (parts.length < 2) {
                s[code] = 100;
                continue;
            }
            const [sectorCode, share] = parts;
            if (share === "disabled") {
                disabled.push(sectorCode);
            }
            try {
                s[sectorCode] = parseInt(share);
            } catch(e) {
                s[sectorCode] = 100;
            }
        }
    }

    // if the naics attribute is set, we select all sectors that are not
    // disabled explicitly
    if (config.naics && config.naics.length > 0) {
        for (const sector of sectors) {
            if (disabled.indexOf(sector.code) >= 0) {
                continue;
            }
            const share = s[sector.code];
            if (isNone(share)) {
                s[sector.code] = 100;
            }
        }
    }

    return s;
}

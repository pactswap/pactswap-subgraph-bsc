import { Address, BigInt } from "@graphprotocol/graph-ts";
import { BEP20 } from "../../generated/Factory/BEP20";

export function fetchName(address: Address): string {
    const contract = BEP20.bind(address);

    const nameResult = contract.try_name();
    if (!nameResult.reverted) {
        return nameResult.value;
    }

    return "unknown";
}

export function fetchSymbol(address: Address): string {
    const contract = BEP20.bind(address);

    const symbolResult = contract.try_symbol();
    if (!symbolResult.reverted) {
        return symbolResult.value;
    }

    return "unknown";
}

export function fetchDecimals(address: Address): BigInt {
    const contract = BEP20.bind(address);

    const decimalResult = contract.try_decimals();
    if (!decimalResult.reverted) {
        return BigInt.fromI32(decimalResult.value);
    }

    return BigInt.fromI32(0);
}

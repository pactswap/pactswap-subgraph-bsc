import { BigInt, BigDecimal, Address } from "@graphprotocol/graph-ts";
import { BEP20 } from "../../generated/Factory/BEP20";
import { BEP20SymbolBytes } from "../../generated/Factory/BEP20SymbolBytes";
import { BEP20NameBytes } from "../../generated/Factory/BEP20NameBytes";
import { Factory as FactoryContract } from "../../generated/templates/Pair/Factory";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const FACTORY_ADDRESS = "0x4cBAF01d645a233D11CD5A19939387A94d7f2f02";

export const ZERO_BI = BigInt.fromI32(0);
export const ONE_BI = BigInt.fromI32(1);
export const ZERO_BD = BigDecimal.fromString("0");
export const ONE_BD = BigDecimal.fromString("1");
export const BI_18 = BigInt.fromI32(18);

export const factoryContract = FactoryContract.bind(Address.fromString(FACTORY_ADDRESS));

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString("1");
    for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
        bd = bd.times(BigDecimal.fromString("10"));
    }
    return bd;
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
    if (exchangeDecimals == ZERO_BI) {
        return tokenAmount.toBigDecimal();
    }
    return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function isNullBnbValue(value: string): boolean {
    return value == "0x0000000000000000000000000000000000000000000000000000000000000001";
}

export function fetchTokenSymbol(tokenAddress: Address): string {
    const contract = BEP20.bind(tokenAddress);
    const contractSymbolBytes = BEP20SymbolBytes.bind(tokenAddress);

    let symbolValue = "unknown";
    const symbolResult = contract.try_symbol();
    if (symbolResult.reverted) {
        const symbolResultBytes = contractSymbolBytes.try_symbol();
        if (!symbolResultBytes.reverted) {
            if (!isNullBnbValue(symbolResultBytes.value.toHex())) {
                symbolValue = symbolResultBytes.value.toString();
            }
        }
    } else {
        symbolValue = symbolResult.value;
    }
    return symbolValue;
}

export function fetchTokenName(tokenAddress: Address): string {
    const contract = BEP20.bind(tokenAddress);
    const contractNameBytes = BEP20NameBytes.bind(tokenAddress);

    let nameValue = "unknown";
    const nameResult = contract.try_name();
    if (nameResult.reverted) {
        const nameResultBytes = contractNameBytes.try_name();
        if (!nameResultBytes.reverted) {
            if (!isNullBnbValue(nameResultBytes.value.toHex())) {
                nameValue = nameResultBytes.value.toString();
            }
        }
    } else {
        nameValue = nameResult.value;
    }
    return nameValue;
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
    const contract = BEP20.bind(tokenAddress);
    let decimalValue = 0;
    const decimalResult = contract.try_decimals();
    if (!decimalResult.reverted) {
        decimalValue = decimalResult.value;
    }
    return BigInt.fromI32(decimalValue as i32);
}

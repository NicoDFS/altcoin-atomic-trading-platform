// 7200, "0x" + secret.hashedSecret, AppConfig.hosts[1].defaultWallet, 10, 2000000

import "jest";
import {SecretGenerator} from "../src/common/hashing";
import {AtomicSwapAbi} from "../src/config/abi/atomicswap";
import {AtomicSwapBin} from "../src/config/abi/bin";
import {EthConfiguration} from "../src/config/config-eth";
import {EthParticipateParams} from "../src/eth/atomic-swap";
import {EthInitiateParams} from "../src/eth/atomic-swap/eth-initiate-params";
import {EthAtomicSwap} from "../src/eth/eth-atomic-swap";
import {EthWalletTestnet} from "../src/ethtestnet/eth-wallet-testnet";

describe("EthAtomicSwap", () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  it("Should pass sanity", () => {
    expect(typeof EthAtomicSwap).toBe("function");
  });

  it("Should pass initiate", async () => {
    expect.assertions(1);

    const ethSwap = new EthAtomicSwap(AtomicSwapAbi, EthConfiguration.hosts[0], AtomicSwapBin);

    const newAccount = ethSwap.engine.createAccount("customPassword");
    const store = newAccount.keystore;
    ethSwap.engine.login(store, "customPassword");

    const secret = SecretGenerator.generateSecret();

    try {
      await ethSwap.initiate(
        new EthInitiateParams(7200, EthConfiguration.hosts[1].defaultWallet, "0.001"),
      );
    } catch (e) {
      expect(e.message).toEqual("Returned error: insufficient funds for gas * price + value");
    }

  });

  it("Should pass participate", async () => {
    expect.assertions(1);

    const ethSwap = new EthWalletTestnet();

    try {
      const ethParams = new EthParticipateParams(7200,
        "0xc979e7b3fe3f71c1682d071cf17773a955c9667b", "0x6c4d7a11fb699bb020e46f315d8cb87ef2c0f8c8", "0.1",
        // tslint:disable-next-line
        "tprv8ZgxMBicQKsPdxZqLMWLFLxJiYwSnP92WVXzkb3meDwix5nxQtNd21AHzn3UvmJAqEqGoYzR7vtZk8hrujhZVGBh1MMED8JnsNja8gEopYM");
      const result = await ethSwap.participate(ethParams);
      expect(result).toBeTruthy();
      // tslint:disable-next-line
      console.log("PARTICIPATE RESULT:", result);
    } catch (e) {
      expect(e.message).toEqual("Returned error: insufficient funds for gas * price + value");
    }
  });
});

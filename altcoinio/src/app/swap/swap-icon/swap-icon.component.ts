import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Renderer2} from "@angular/core";
import {coinSwapsAnimation} from "../../animations/animations";
import {Coin} from "../../models/coins/coin.model";

@Component({
  selector: "app-swap-icon",
  templateUrl: "./swap-icon.component.html",
  styleUrls: ["./swap-icon.component.scss"],
  animations: [coinSwapsAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwapIconComponent implements OnInit {
  @Input() fromCoin: Coin;
  @Input() toCoin: Coin;
  @Input() swapEnabled: boolean;
  @Output() swapped: EventEmitter<void> = new EventEmitter<void>();
  @Output() chooseDepositCoin: EventEmitter<Coin> = new EventEmitter<Coin>();
  @Output() chooseReceiveCoin: EventEmitter<Coin> = new EventEmitter<Coin>();

  fromCoinAnimationSwapState = "slideBack";
  toCoinAnimationSwapState = "slideBack";
  firstCoin = undefined;
  secondCoin = undefined;
  swapCount = 0;

  constructor(private renderer: Renderer2) {

  }

  ngOnInit() {
    this.firstCoin = this.fromCoin;
    this.secondCoin = this.toCoin;
  }

  ngOnChanges(changes) {
    if (typeof changes.fromCoin !== "undefined" && typeof changes.toCoin == "undefined") {
      if (this.swapCount % 2 == 0)
        this.firstCoin = changes.fromCoin.currentValue;
      else
        this.secondCoin = changes.fromCoin.currentValue;
    }
    else if (typeof changes.toCoin !== "undefined" && typeof changes.fromCoin == "undefined") {
      if (this.swapCount % 2 == 0)
        this.secondCoin = changes.toCoin.currentValue;
      else
        this.firstCoin = changes.toCoin.currentValue;
    }
    else{
      if (this.swapCount % 2 == 0){
        this.firstCoin = changes.fromCoin.currentValue;
        this.secondCoin = changes.toCoin.currentValue;
      }
      else{
        this.firstCoin = changes.toCoin.currentValue;
        this.secondCoin = changes.fromCoin.currentValue;
      }
    }
  }

  animateCoinSwap(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.fromCoinAnimationSwapState === "slideBack") {
      this.fromCoinAnimationSwapState = "slideLeft";
      this.toCoinAnimationSwapState = "slideRight";
    }
    else {
      this.fromCoinAnimationSwapState = "slideBack";
      this.toCoinAnimationSwapState = "slideBack";
    }
    this.swapCount++;
    this.swapped.emit();
  }

  iconClicked(event, coin) {
    event.stopPropagation();
    event.preventDefault();
    if (coin.name == this.fromCoin.name)
      this.chooseDepositCoin.emit(this.fromCoin);
    else if (coin.name == this.toCoin.name)
      this.chooseReceiveCoin.emit(this.toCoin);

  }

  onCoinSelected(coin) {
    this.chooseReceiveCoin.emit(coin);
  }
}

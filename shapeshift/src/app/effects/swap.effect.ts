import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as startAction from '../actions/start.action';
import * as swapAction from '../actions/swap.action';
import * as auditContractAction from '../actions/swap-audit.action';
import * as walletSelector from '../selectors/wallets.selector';
import {Go} from '../actions/router.action';
import {AppState} from '../reducers/app.state';
import {LinkService} from '../services/link.service';
import {SwapService} from '../services/swap.service';
import {QuoteService} from '../services/quote.service';


@Injectable()
export class SwapEffect {

  @Effect()
  generateLink$: Observable<Action> = this.actions$
    .ofType(startAction.START_SWAP)
    .map(toPayload)
    .withLatestFrom(this.store.select(walletSelector.getWalletState))
    .mergeMap(([data, wallets]) => {
      console.log(wallets);
      return this.linkService.generateLink(data, wallets).mergeMap(link => {
          return Observable.from([
            new startAction.SetLinkAction(link),
            new Go({
              path: ['/transfer'],
            }),
          ]);
        });
      },
    );

  @Effect()
  initiate$: Observable<Action> = this.actions$
    .ofType(swapAction.INITIATE)
    .map(toPayload)
    .mergeMap(payload => {
      return this.swapService.initiate(payload)
        .map(res => new swapAction.InitiateSuccessAction(res))
        .catch(err => Observable.of(new swapAction.InitiateFailAction(err)));
    });

  @Effect()
  auditContract$: Observable<Action> = this.actions$
    .ofType(auditContractAction.SWAP_AUDIT)
    .map(toPayload)
    .mergeMap(payload => {
      return this.swapService.auditContract(payload).map(r => {
        return new auditContractAction.SwapAuditSuccessAction(r);
      });
    });


  constructor(private linkService: LinkService,
              private quoteService: QuoteService,
              private actions$: Actions,
              private store: Store<AppState>,
              private swapService: SwapService) {
  }
}

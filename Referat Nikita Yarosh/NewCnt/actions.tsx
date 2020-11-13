import React from 'react';
import { ActualizationCnt, NewCnt } from './NewCnt';
import { SentinelDetail, SentinelDropActions } from '@gor-tts/sentinel-portal-component-library';
import { GetRenderItemHeader, fetchInfo, JSONparse, GET_URL_HEADER, getURL, GetRenderModal, dropActionHandleOnClick } from '../../utils';
import { iDropActionsParams, iModal, iShowNuItem } from '../../types';
import { TTSDropdown } from '@gor-tts/sentinel-component-library';

/**
 * Zobrazení dialogového okna vytvoření kontaktu
 * @param params 
 */
export const showNewCnt = async ({ id, setModal, onComplete, saveNUItem }: iShowNuItem) =>
  await fetchInfo(typeof id !== 'undefined' ? { action_type: 'detail:contact', object_uuid: id } : { action_type: 'contact', })
    .then((res) => res.json().then((resp) => JSONparse(resp.item)))
    .then((result) => {
      setModal((prev: iModal) => ({
        ...prev,
        show: true,
        style: {
          width: '35%',
          minWidth: '30%'
        },
        header: (GetRenderItemHeader({
          item: result.item,
          text: {
            new: Liferay.Language.get('novy_kontakt'),
            update: Liferay.Language.get('aktualizace_kontaktu')
          }
        })),
        content: (
          <NewCnt
            id={id}
            item={result.item}
            saveItem={saveNUItem}
            closeHandle={() => setModal({ show: false })}
          />
        )
      }))
    })
    .then(onComplete != null ? onComplete : null)
    .catch((err) => {
      console.error(err);
      (typeof onComplete === 'function') && onComplete()
    })

export const showActualizationCnt = async ({ id, setModal, onComplete, saveNUItem }: iShowNuItem) =>
  await fetchInfo(typeof id !== 'undefined' ? { action_type: 'detail:contact', object_uuid: id } : { action_type: 'contact' })
    .then((res) => res.json().then((resp) => JSONparse(resp.item)))
    .then((result) => {
      setModal((prev: iModal) => ({
        ...prev,
        show: true,
        style: {
          width: '37%',
          minWidth: '30%'
        },
        header: (GetRenderItemHeader({
          item: result.item,
          text: {
            new: Liferay.Language.get('novy_kontakt'),
            update: Liferay.Language.get('aktualizace_kontaktu')
          }
        })),
        content: (
          <ActualizationCnt
            id={id}
            item={result.item}
            saveItem={saveNUItem}
            closeHandle={() => setModal({ show: false })}
          />
        )
      }))
    })
    .then(onComplete != null ? onComplete : null)
    .catch((err) => {
      console.error(err);
      (typeof onComplete === 'function') && onComplete()
    })

interface iShowCntDetail {
  setModal: React.Dispatch<React.SetStateAction<iModal>>
  id: any
  dropActions: iDropActionsParams
  action?: string | (() => void)
}

const ContactDropActions = ({ id, showNewItem, dropdownAlert, setRefresh, fetchActions, afterAction }: iDropActionsParams) => {
  const [modal, setModal] = React.useState<iModal>({ show: false })
    , handleDropActionClick = (props: any, onComplete?: () => void, actionBtn?: any, setIsLoaded?: React.Dispatch<React.SetStateAction<boolean>>, getActionButtons?: () => Promise<void>, comment?: string) =>
      dropActionHandleOnClick(
        { type: "contact", comment: comment, ...props },
        onComplete,
        actionBtn,
        setIsLoaded,
        getActionButtons
      ).finally(() => { if (!actionBtn.wf_formular || actionBtn.wf_formular !== "1") handleAfterAction() })
    , handleAfterAction = () => {
      setModal({ show: false })
      typeof afterAction === "function" && afterAction()
    }
    // reakce na kliknutí na položku nabídky na detailu
    , showUpdateFunc = (onComplete: any, id: any) => showNewItem(onComplete, id, setModal, true, handleAfterAction)
  return (
    <>
      {GetRenderModal(modal, setModal)}
      <TTSDropdown class='ramen-drop-action'>
        {(_id, toggleOpen) => (
          <SentinelDropActions
            id={id}
            onAlert={dropdownAlert}
            onChangeFunc={() => {
              if (toggleOpen) toggleOpen()
              setRefresh(true)
            }}
            updateFunc={showUpdateFunc} // kliknutí na položku nabídky detailu
            handleActionClick={handleDropActionClick}
            fetchActions={fetchActions}
            actionClass='ramen-drop-action-item-btn'
            lang={{
              noActions: Liferay.Language.get("no_actions"),
              commentPlaceholder: Liferay.Language.get("zadejte_komentar"),
              btn: {
                confirmInfo: Liferay.Language.get("action_btn_confirm_info"),
                confirmReject: Liferay.Language.get("action_btn_confirm_reject"),
                confirmSubmit: Liferay.Language.get("action_btn_confirm_submit")
              }
            }}
          />
        )}
      </TTSDropdown>
    </>
  )
}

export const showContactDetail = async (props: iShowCntDetail) => {
  const { id, setModal, action, dropActions } = props
  await fetch(getURL("/o/contact-openapi/v1.0/contacts/" + id), GET_URL_HEADER)
    .then((res) => typeof res.json === "function" ? res.json() : "")
    .then((result) => result != null && result.json_item != null ? JSONparse(result.json_item) : result)
    .then((result) =>
      setModal((prev: iModal) => ({
        ...prev,
        show: true,
        header: (
          <div style={{ display: "flex" }}>
            <ContactDropActions
              id={id}
              dropdownAlert={dropActions.dropdownAlert}
              showNewItem={dropActions.showNewItem}
              fetchActions={dropActions.fetchActions}
              setRefresh={dropActions.setRefresh}
              afterAction={() => showContactDetail({ ...props })}
            />
            <h2 className='h2-bold'>
              {Liferay.Language.get("contacts_detail") + " [" + result.id + "]"}
            </h2>
          </div>
        ),
        style: {
          maxWidth: "50%",
          minWidth: "40%"
        },
        content: (<SentinelDetail
          style={{ overflow: "auto" }}
          doms={[
            {
              label: Liferay.Language.get('jmeno'),
              key: 'first_name'
            },
            {
              label: Liferay.Language.get('prijmeni'),
              key: 'last_name'
            },
            {
              label: Liferay.Language.get('titul'),
              key: 'middle_name'
            },
            {
              label: Liferay.Language.get('titul_za_jmenem'),
              key: 'ztitul_za_jmenem'
            },
            {
              label: Liferay.Language.get('mobil'),
              type: 'textInput',
              key: 'mobile_phone'
            },
            {
              label: Liferay.Language.get('telephone'),
              key: 'phone_number',
            },
            {
              label: Liferay.Language.get('email'),
              key: 'email_address',
            },
            {
              label: Liferay.Language.get('pracovni_pozice'),
              key: 'position_select2',
            },
            {
              label: Liferay.Language.get('organization'),
              key: 'organizationlabel'
            }
          ]}
          items={result}
        />),
        handleClose: () => {
          if (typeof action === "string" && action === "WF_actions")
            history.pushState("", document.title, window.location.pathname)
          setModal((prev: iModal) => ({ ...prev, show: false }))
        }
      }))
    )
    .catch((err) => console.error(err))
    .finally(() => typeof action === "function" && action())
}
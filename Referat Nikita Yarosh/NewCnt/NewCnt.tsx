import React from "react";
import { getList, newDate, GetDate, GetRenderValidationInfoEmpty, fetchInfo, JSONparse } from "../../utils/index";
import { SentinelNuAction } from "@gor-tts/sentinel-portal-component-library";
import { iNewItem } from '../../types'
import { nameRegex, phoneFlapRegex, mobileRegex, emailRegex, isEmpty } from "../../utils"

const flexValue = "0 0 21%"

/**
 * Třída vytvoření nového kontaktu
 * @param props Vlastnosti vytvoření nové položky
 */
export const NewCnt = (props: iNewItem) => {
  const [values, setValues] = React.useState<any>(props.item || {})
    , [disables, setDisable] = React.useState<any>({})
    , [validationInfo, setValidationInfo] = React.useState<any>(null)
    , getOrgs = async (search: any, page: any) => getList('organizace', search, page)
    , getContactTypes = async (search: any, page: any) => getList('typ_kontaktu', search, page)
    , getPositions = async (search: any, page: any) => getList('positions', search, page)
    , handleSave = (result: any, onValidation: any, onComplete: any) => {
      typeof props !== 'undefined' && typeof props.saveItem === 'function'
        && props.saveItem(result, onValidation, (content: any) => setValidationInfo(typeof content !== 'undefined' ? content : ''), onComplete)
    }
    , getId = (res: any) => {
      const startId = res.indexOf("\'") + 1
        , endId = res.lastIndexOf("\'")
      return startId !== -1 && endId !== -1 ? res.substring(startId, endId) : ""
    }
    , checkForDisable = (variable: any): boolean => (variable ?? variable?.trim().length)
    , getContacts = async (search: any, page: any) =>
      getList('kontakty_interni', search, page)
  return (
    <SentinelNuAction
      items={[
        { type: 'static', key: 'id' },
        {
          label: Liferay.Language.get("name_surname"),
          type: "select2",
          key: "full_name",
          getItemsAsync: getContacts,
          changeResponse: (result: any) => {
            const id = getId(result)
            console.log(result)
            if (!isEmpty(id)) {
              fetchInfo({ action_type: 'detail:contact', object_uuid: id })
                .then((res) => res.json().then((resp) => JSONparse(resp.item)))
                .then((result) => {
                  console.log(result)
                  const first_name = result.item.first_name
                    , last_name = result.item.last_name
                  setValues((prev: any) => ({
                    ...prev,
                    first_name,
                    last_name,
                    refresh_data: !!checkForDisable(first_name) && !!checkForDisable(last_name),
                    email_address: result.item.email_address,
                    middle_name: result.item.middle_name,
                    ztitul_za_jmenem: result.item.ztitul_za_jmenem,
                    ctp_select2: result.item.type_select2,
                    mobile_phone: result.item.mobile_phone,
                    telephone: result.item.phone_number,
                    org_select2: result.item.organization_select2
                  }))
                  setDisable((prev: any) => ({
                    ...prev,
                    first_name: !checkForDisable(first_name),
                    last_name: !checkForDisable(last_name)
                  }))
                })
                .catch((err) => {
                  console.error(err);
                })
            }
          },
          labelStyle: { flex: flexValue }
        },
        {
          label: `${Liferay.Language.get("refresh")} ${values.first_name} ${values.last_name}`,
          labelStyle: { flex: "0 !important", whiteSpace: "nowrap", fontStyle: "italic" },
          type: "checkbox",
          key: "refresh_data",
          show: !!checkForDisable(values.first_name) && !!checkForDisable(values.last_name),
          changeResponse: (res: boolean) => {
            console.log(res)
            setDisable((prev: any) => ({
              ...prev,
              first_name: !res,
              last_name: !res
            }))
          }
        },
        {
          label: Liferay.Language.get('jmeno'),
          type: 'textInput',
          key: 'first_name',
          placeholder: "např. Jakub",
          rules: { match: nameRegex, label: Liferay.Language.get("validation_name_wrong_format") },
          required: true,
          requiredMessage: Liferay.Language.get("validation_no_name"),
          disabled: disables.first_name ?? true,
          labelStyle: { flex: flexValue }
        },
        {
          label: Liferay.Language.get('prijmeni'),
          type: 'textInput',
          key: 'last_name',
          placeholder: "např. Fiala",
          rules: { match: nameRegex, label: Liferay.Language.get("validation_surname_wrong_format") },
          required: true,
          requiredMessage: Liferay.Language.get("validation_no_surname"),
          disabled: disables.last_name ?? true,
          labelStyle: { flex: flexValue }
        },
        {
          label: Liferay.Language.get('titul'),
          type: 'textInput',
          key: 'middle_name'
        },
        {
          label: Liferay.Language.get('titul_za_jmenem'),
          type: 'textInput',
          key: 'ztitul_za_jmenem',
          labelStyle: { flex: flexValue }
        },
        {
          label: Liferay.Language.get('datum_narozeni'),
          type: 'dateTime',
          key: 'zdatum_narozeni',
          changeResponse: (res: string | Date) => {
            const _date = newDate(res)
            setValues((prev: any) => ({
              ...prev,
              pocatek_cas: GetDate(_date || new Date())
            }))
          },
          maxDate: new Date(),
          labelStyle: { flex: flexValue }
        },
        {
          label: Liferay.Language.get('telefonni_klapka'),
          type: 'textInput',
          key: 'phone_flap',
          placeholder: "např. 123",
          rules: { match: phoneFlapRegex, label: Liferay.Language.get("validation_flap_wrong_format") },
          required: true,
          requiredMessage: Liferay.Language.get("validation_no_flap"),
          labelStyle: { flex: flexValue }
        },
        {
          label: Liferay.Language.get('mobil'),
          type: 'textInput',
          key: 'mobile_phone',
          placeholder: "např. +420-123-456-789",
          rules: { match: mobileRegex, label: Liferay.Language.get("validation_mobile_phone_wrong_format") },
          required: true,
          requiredMessage: Liferay.Language.get("validation_no_mobile_phone"),
          labelStyle: { flex: flexValue }
        },
        {
          label: Liferay.Language.get('telephone'),
          type: 'textInput',
          key: 'telephone',
          placeholder: "např. 123-456-789",
          rules: { match: mobileRegex, label: Liferay.Language.get("validation_telephone_wrong_format") },
          required: true,
          requiredMessage: Liferay.Language.get("validation_no_telephone"),
          labelStyle: { flex: flexValue }
        },
        {
          label: Liferay.Language.get('email'),
          type: 'textInput',
          key: 'email_address',
          placeholder: "např. example@gmail.com",
          rules: { match: emailRegex, label: Liferay.Language.get("validation_email_wrong_format") },
          required: true,
          requiredMessage: Liferay.Language.get("validation_no_email_address"),
          labelStyle: { flex: flexValue }
        },
        {
          label: Liferay.Language.get('typ_kontaktu'),
          type: 'select2',
          key: 'ctp_select2',
          getItemsAsync: getContactTypes,
          responseValues: { value: 'id', label: 'label' },
          labelStyle: { flex: flexValue }
        },
        {
          label: Liferay.Language.get('pracovni_pozice'),
          type: 'select2',
          key: 'position_select2',
          getItemsAsync: getPositions,
          responseValues: { value: 'id', label: 'label' },
          labelStyle: { flex: flexValue }
        },
        {
          label: Liferay.Language.get('poznamka'),
          type: 'textareaInput',
          key: 'comments',
          labelStyle: { flex: flexValue }
        },
        {
          label: Liferay.Language.get('vizitkova_pozice'),
          type: 'textInput',
          key: 'zvizitkova_pozice',
          labelStyle: { flex: flexValue }
        },
        {
          label: Liferay.Language.get('organization'),
          type: 'select2',
          key: 'org_select2',
          getItemsAsync: getOrgs,
          responseValues: { value: 'id', label: 'label' },
          labelStyle: { flex: flexValue }
        }
      ]}
      values={values}
      closeHandle={props.closeHandle}
      customFooter={GetRenderValidationInfoEmpty(validationInfo)}
      lang={{
        submit: Liferay.Language.get('submit'),
        close: Liferay.Language.get('zavrit')
      }}
      submitHandler={handleSave}
    />)
}

export const ActualizationCnt = (props: iNewItem) => {
  const [values, setValues] = React.useState<any>(props.item || {})
    , [validationInfo, setValidationInfo] = React.useState<any>(null)
    , getOrgs = async (search: any, page: any) => getList('organizace', search, page)
    , getContactTypes = async (search: any, page: any) => getList('typ_kontaktu', search, page)
    , getPositions = async (search: any, page: any) => getList('positions', search, page)
    , handleSave = (result: any, onValidation: any, onComplete: any) => {
      typeof props !== 'undefined' && typeof props.saveItem === 'function'
        && props.saveItem(result, onValidation, (content: any) => setValidationInfo(typeof content !== 'undefined' ? content : ''), onComplete)
    }
  return (
    <SentinelNuAction
      items={[
        { type: 'static', key: 'id' },
        {
          label: Liferay.Language.get('jmeno'),
          type: 'textInput',
          key: 'first_name',
          placeholder: "např. Jakub",
          rules: { match: nameRegex, label: Liferay.Language.get("validation_name_wrong_format") },
          required: true,
          requiredMessage: Liferay.Language.get("validation_no_name")
        },
        {
          label: Liferay.Language.get('prijmeni'),
          type: 'textInput',
          key: 'last_name',
          placeholder: "např. Fiala",
          rules: { match: nameRegex, label: Liferay.Language.get("validation_surname_wrong_format") },
          required: true,
          requiredMessage: Liferay.Language.get("validation_no_surname")
        },
        {
          label: Liferay.Language.get('titul'),
          type: 'textInput',
          key: 'middle_name'
        },
        {
          label: Liferay.Language.get('titul_za_jmenem'),
          type: 'textInput',
          key: 'ztitul_za_jmenem'
        },
        {
          label: Liferay.Language.get('datum_narozeni'),
          type: 'dateTime',
          key: 'zdatum_narozeni',
          changeResponse: (res: string | Date) => {
            const _date = newDate(res)
            setValues((prev: any) => ({
              ...prev,
              pocatek_cas: GetDate(_date || new Date())
            }))
          },
          maxDate: new Date()
        },
        {
          label: Liferay.Language.get('telefonni_klapka'),
          type: 'textInput',
          key: 'phone_flap',
          placeholder: "např. 123",
          rules: { match: phoneFlapRegex, label: Liferay.Language.get("validation_flap_wrong_format") },
          required: true,
          requiredMessage: Liferay.Language.get("validation_no_flap")
        },
        {
          label: Liferay.Language.get('mobil'),
          type: 'textInput',
          key: 'mobile_phone',
          placeholder: "např. +420-123-456-789",
          rules: { match: mobileRegex, label: Liferay.Language.get("validation_mobile_phone_wrong_format") },
          required: true,
          requiredMessage: Liferay.Language.get("validation_no_mobile_phone")
        },
        {
          label: Liferay.Language.get('telephone'),
          type: 'textInput',
          key: 'phone_number',
          placeholder: "např. 123-456-789",
          rules: { match: mobileRegex, label: Liferay.Language.get("validation_telephone_wrong_format") },
          required: true,
          requiredMessage: Liferay.Language.get("validation_no_telephone")
        },
        {
          label: Liferay.Language.get('email'),
          type: 'textInput',
          key: 'email_address',
          placeholder: "např. example@gmail.com",
          rules: { match: emailRegex, label: Liferay.Language.get("validation_email_wrong_format") },
          required: true,
          requiredMessage: Liferay.Language.get("validation_no_email_address")
        },
        {
          label: Liferay.Language.get('typ_kontaktu'),
          type: 'select2',
          key: 'ctp_select2',
          getItemsAsync: getContactTypes,
          responseValues: { value: 'id', label: 'label' },
        },
        {
          label: Liferay.Language.get('pracovni_pozice'),
          type: 'select2',
          key: 'position_select2',
          getItemsAsync: getPositions,
          responseValues: { value: 'id', label: 'label' },
        },
        {
          label: Liferay.Language.get('poznamka'),
          type: 'textareaInput',
          key: 'comments'
        },
        {
          label: Liferay.Language.get('vizitkova_pozice'),
          type: 'textInput',
          key: 'zvizitkova_pozice'
        },
        {
          label: Liferay.Language.get('organization'),
          type: 'select2',
          key: 'organization_select2',
          getItemsAsync: getOrgs,
          responseValues: { value: 'id', label: 'label' },
        }
      ]}
      values={values}
      closeHandle={props.closeHandle}
      customFooter={GetRenderValidationInfoEmpty(validationInfo)}
      lang={{
        submit: Liferay.Language.get('submit'),
        close: Liferay.Language.get('zavrit')
      }}
      submitHandler={handleSave}
    />)
}
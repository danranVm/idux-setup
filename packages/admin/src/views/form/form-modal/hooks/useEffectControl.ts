import { reactive, readonly } from 'vue'

import type { FormGroup, AbstractControl } from '@idux/cdk/forms'

type EffectControl<T> = {
  controlKey: string
  control?: AbstractControl<T>
}

type ContorlEffectConfig = Record<
  string,
  {
    show: string[]
    hide?: string[]
  }
>

type EffectItem = {
  effect?: ContorlEffectConfig
}

type Effect<T> = EffectControl<T> & EffectItem

type FormVal = string | number | boolean

export type EffectConfig = Record<string, EffectItem>

/**
 * 生成被策略影响的control对应的显隐状态
 * */
const createEffectStatus = (effectConfig: EffectConfig) => {
  const visibleMap: Record<string, boolean> = {}
  Object.keys(effectConfig).forEach(controlKey => {
    visibleMap[controlKey] = true
    Object.keys(effectConfig[controlKey].effect ?? {}).forEach(formVal => {
      visibleMap[`${controlKey}.${formVal}`] = true
    })
  })
  return visibleMap
}

export function useEffectControl<T extends object = object>(
  formGroup: FormGroup<T>,
  effectConfigs: EffectConfig,
) {
  let contorlMap: Map<string, Effect<T>>
  let effectSet: Set<string>

  // 受影响的contorl的显隐状态的映射
  const effectControlStatus = reactive(createEffectStatus(effectConfigs))

  const initMap = () => {
    contorlMap = new Map()
  }

  /**
   * 更新contorl映射
   */
  const updateControlMap = (controlConfigs: EffectControl<T> | EffectControl<T>[]) => {
    const controlConfigArr = Array.isArray(controlConfigs) ? controlConfigs : [controlConfigs]
    controlConfigArr.forEach(item => {
      if (contorlMap.has(item.controlKey)) {
        return
      }
      contorlMap.set(item.controlKey, {
        control: item.control,
        controlKey: item.controlKey,
        ...effectConfigs[item.controlKey],
      })
    })
  }

  /**
   * 更新contorl对应的effect配置
   */
  const updateEffectByMap = (controlKey: string, effect: ContorlEffectConfig) => {
    if (!contorlMap.has(controlKey)) {
      return
    }
    const contorlConfig = contorlMap.get(controlKey)
    contorlMap.set(controlKey, {
      ...contorlConfig!,
      effect,
    })
  }

  /**
   * 设置会影响到其他表单项的contorlKey的set
   */
  const setEffectSet = (contorlKeys: string[]) => {
    effectSet = new Set(contorlKeys)
  }

  /**
   * 获取单个control
   */
  const getControlByKey = (controlKey: string) => ({
    controlKey,
    control: formGroup.get(controlKey),
  })

  /**
   * 批量获取control
   */
  const getControlArrByKeys = (controlKeys: string[]) => {
    return controlKeys.map(key => getControlByKey(key))
  }

  /**
   * 获取需要隐藏的control的key
   */
  const getHideControlKeys = (config: ContorlEffectConfig, formValue: string) => {
    return Object.keys(config).reduce((controlKeys, value) => {
      const controlKeysToAdd =
        String(value) === formValue ? config[value].hide ?? [] : config[value].show
      return [...controlKeys, ...controlKeysToAdd]
    }, [] as string[])
  }

  const updateEffectControlMap = (controlKey: string) => {
    const strategyConfig = effectConfigs[controlKey].effect ?? {}
    const effect: ContorlEffectConfig = {}
    Object.keys(strategyConfig).forEach(formVal => {
      effect[formVal] = {
        hide: getHideControlKeys(strategyConfig, formVal),
        show: strategyConfig[formVal]?.show || [],
      }
      const hideArr = getControlArrByKeys(effect[formVal].hide!)
      const showArr = getControlArrByKeys(effect[formVal].show)
      updateControlMap([...hideArr, ...showArr])
    })
    updateEffectByMap(controlKey, effect)
  }

  const updateEffectControlStatus = (key: string, isShow: boolean) => {
    effectControlStatus[key] = isShow
  }

  /**
   * 批量开启control的校验
   * */
  const enableAffectedControls = (affectedKeys?: string[]) => {
    affectedKeys?.forEach(affectedKey => {
      if (!contorlMap.has(affectedKey)) {
        return
      }
      const affectedConfig = contorlMap.get(affectedKey)!
      const control = affectedConfig.control!
      control.enable()
      if (effectSet.has(affectedKey)) {
        // value可能是其他类型，但是会拿来做转换判断的一定是这几个值才会影响其他表单项（比如下拉，选择等）
        updateControl(affectedConfig, control.getValue() as unknown as FormVal)
      }
    })
  }

  /**
   * 批量禁用control，方便跳过校验
   * */
  const disabledAffectedControls = (affectedKeys?: string[]) => {
    affectedKeys?.forEach(affectedKey => {
      if (!contorlMap.has(affectedKey)) {
        return
      }
      const affectedConfig = contorlMap.get(affectedKey)!
      const control = affectedConfig.control!
      control.disable()
      control.reset()
      if (effectSet.has(affectedKey)) {
        // value可能是其他类型，但是会拿来做转换判断的一定是这几个值才会影响其他表单项（比如下拉，选择等）
        updateControl(affectedConfig, control.getValue() as unknown as FormVal, {
          // 父控制器禁用的情况下不允许子表单项启用
          isEnable: false,
        })
      }
    })
  }

  /**
   * 根据当前表单项的值，对应更改策略中配置的会被影响的control
   * */
  const updateControl = (
    effectConfig: Effect<T>,
    value: string | number | boolean,
    options?: {
      isEnable?: boolean
      isDisable?: boolean
    },
  ) => {
    const effect = effectConfig.effect
    if (!effect) {
      return
    }
    const { isEnable = true, isDisable = true } = options ?? {}
    Object.keys(effect).forEach(effectKey => {
      const affected = effect[effectKey]
      const isShow = effectKey === String(value)
      updateEffectControlStatus(`${effectConfig.controlKey}.${effectKey}`, isShow)
      const enableArr = isShow ? affected.show : affected.hide
      const disableArr = isShow ? affected.hide : affected.show
      if (isEnable) {
        enableAffectedControls(enableArr)
      } else {
        disabledAffectedControls(enableArr)
      }
      isDisable && disabledAffectedControls(disableArr)
    })
  }

  /**
   * 生成被策略影响的control
   * */
  const createEffectControl = () => {
    const controlKeys = Object.keys(effectConfigs)
    setEffectSet(controlKeys)
    initMap()
    controlKeys.forEach(controlKey => {
      updateControlMap(getControlByKey(controlKey))
      updateEffectControlMap(controlKey)
    })
  }

  /**
   * 监听会影响表单展示的表单项，对应更新被影响的control
   */
  const addControlEvent = () => {
    effectSet.forEach(effectKey => {
      const effectConfig = contorlMap.get(effectKey)
      effectConfig?.control?.watchValue(
        value => {
          // value可能是其他类型，但是会拿来做转换判断的一定是这几个值才会影响其他表单项（比如下拉，选择等）
          updateControl(effectConfig, value as unknown as FormVal)
        },
        {
          immediate: true,
        },
      )
    })
  }

  createEffectControl()
  addControlEvent()

  return {
    effectControlStatus: readonly(effectControlStatus),
  }
}

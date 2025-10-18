import { env } from "bun";

const toBackup = Object.entries(env).filter(([k]) => k.startsWith("BAK"))

const { containers } = toBackup.filter(([k]) => k.startsWith("BAK_POSTGRES")).reduce((acc, [k, v]) => {
  if (!v) {
    console.warn("Invalid value for", k)
    return acc

  }
  const [index, type] = k.split("BAK_POSTGRES_").at(1)?.split("_") ?? []
  const key = type?.toLocaleLowerCase()
  console.log(k, index, type)


  if (key !== 'container' && key !== 'user' && key !== 'database') {
    console.warn("Uknown variable", k, v)
    return acc
  }

  const accIndex = Number(index) - 1
  if (acc.containers[accIndex]) {
    const thisConfig = acc.containers[accIndex]
    if (!thisConfig) {
      throw `Parsing failed: ${accIndex} ${JSON.stringify(acc)}`
    }
    thisConfig[key as keyof PostgresContainer] = v


  } else {
    acc.containers.push(Object.assign({ container: "", user: "postgres", database: "postgre" }, {
      [key]: v
    }))
  }
  acc.lastIndex = accIndex
  return acc

}, { lastIndex: 0, containers: [] as PostgresContainer[] })

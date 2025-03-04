import kebabCase from 'lodash/kebabCase'
import orderBy from 'lodash/orderBy'
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

import { GUILD, MAX_RANK, REALM, REGION } from '../lib/config'
import { Character } from '../types/secret'

const sections = [
  'tier'
  // 'legendaries'
] as const

type Props = {
  characters: Array<Character>
}

const Legendaries: NextPage<Props> = ({ characters }) => (
  <main className="m-6">
    <h1 className="text-4xl font-bold text-amber-400 capitalize">
      {sections.join(' + ')}
    </h1>

    <section className="grid gap-6 mt-6 lg:grid-cols-2">
      {characters.map((character) => (
        <div
          className="grid gap-6 p-3 rounded-lg lg:grid-cols-3 bg-neutral-900"
          key={character.name}>
          <Link
            className="flex items-center"
            href={`https://raider.io/characters/${REGION.toLowerCase()}/${kebabCase(
              REALM
            )}/${encodeURIComponent(character.name)}`}>
            <Image
              alt={character.name}
              className="rounded-lg bg-amber-900"
              height={48}
              src={character.image}
              unoptimized
              width={48}
            />

            <div className="ml-3">
              <div>{character.name}</div>
              <div className="text-sm text-neutral-400 tabular-nums">
                {character.ilvl}
              </div>
            </div>
          </Link>

          {sections.map((key) => (
            <div className="flex items-center justify-end" key={key}>
              {character[key].length > 0 && (
                <div className="flex flex-col">
                  {character[key].map((item) => (
                    <div
                      className="flex items-center justify-end"
                      key={item.slot}>
                      <div className="text-neutral-400">{item.slot}</div>
                      <div className="ml-3 font-medium tabular-nums">
                        {item.ilvl}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                className={twMerge(
                  'font-medium text-2xl tabular-nums  ml-6',
                  key === 'tier' ? 'text-[#a335ee]' : 'text-[#ff8000]'
                )}>
                {character[key].length}
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  </main>
)

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const response = await fetch(
    `https://raider.io/api/guilds/roster?region=${REGION.toLowerCase()}&realm=${kebabCase(
      REALM
    )}&guild=${encodeURIComponent(GUILD)}`
  )

  const data: {
    guildRoster: {
      roster: Array<{
        rank: number
        character: {
          name: string
          thumbnail: string
          items: {
            item_level_equipped: number
            items: Record<
              string,
              {
                is_legendary: boolean
                item_level: number
                tier?: number
              }
            >
          }
        }
      }>
    }
  } = await response.json()

  const characters = data.guildRoster.roster
    .filter(({ rank }) => rank <= MAX_RANK)
    .map(
      ({
        character: {
          items: { item_level_equipped, items },
          name,
          thumbnail
        }
      }) => ({
        ilvl: item_level_equipped,
        image: `https://render.worldofwarcraft.com/eu/character/${thumbnail}`,
        legendaries: Object.entries(items)
          .filter(([, item]) => item?.is_legendary)
          .map(([slot, { item_level }]) => ({
            ilvl: item_level,
            slot
          })),
        name,
        tier: Object.entries(items)
          .filter(([, item]) => !!item?.tier)
          .map(([slot, { item_level }]) => ({
            ilvl: item_level,
            slot
          }))
      })
    )

  return {
    props: {
      characters: orderBy(characters, 'name')
    }
  }
}

export default Legendaries

import Image from 'next/image'
import { FunctionComponent } from 'react'

import { Member } from '../types'
import { Icon } from './icon'

type Props = {
  character: Member
}

export const CharacterCard: FunctionComponent<Props> = ({ character }) => (
  <div className="flex flex-col items-center text-center">
    <figure className="relative" title={character.spec.role}>
      <Image
        alt={character.name}
        className="rounded-lg bg-amber-900"
        height={116}
        src={character.image}
        width={230}
      />

      {character.rank === 0 && (
        <Icon className="absolute text-teal-400 -top-2 -left-2" name="star" />
      )}

      {character.name === 'Wazzuli' && (
        <Icon className="absolute text-rose-400 -top-2 -left-2" name="heart" />
      )}

      <Icon
        className="absolute -bottom-2 -right-2 text-amber-400"
        name={
          character.spec.role === 'tank'
            ? 'shield'
            : character.spec.role === 'healer'
            ? 'hospital'
            : character.spec.melee
            ? 'sword'
            : 'arrow'
        }
      />
    </figure>

    <div className="mt-6">
      <div className="text-2xl font-medium text-amber-400">
        {character.name}
      </div>

      <div className="mt-2 font-medium text-neutral-400">
        {character.race.name} &#215; {character.spec.name}{' '}
        {character.class.name}
      </div>
    </div>
  </div>
)

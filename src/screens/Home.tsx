import { AKG } from '../design/akg';
import { cardsInSystem, content } from '../content';
import { href } from '../router';
import { APP_VERSION } from '../version';
import { Screen } from './common';

export function Home() {
  const systems = content.systems.filter((s) => !s.library);
  const library = content.systems.find((s) => s.library);
  const count = (id: string) => cardsInSystem(id).length;
  return (
    <Screen title="Wards" large>
      <AKG.List header="Systems">
        {systems.map((s) => (
          <AKG.ListRow key={s.id} title={s.title} detail={count(s.id) ? String(count(s.id)) : undefined} chevron href={href.system(s.id)} />
        ))}
      </AKG.List>
      {library && (
        <AKG.List footer="Physical exam, scores, pathways, ECG and imaging libraries, labs, procedures and medications.">
          <AKG.ListRow title={library.title} detail={count(library.id) ? String(count(library.id)) : undefined} chevron href={href.system(library.id)} />
        </AKG.List>
      )}
      <p className="ios-footnote version">Version {APP_VERSION}</p>
    </Screen>
  );
}

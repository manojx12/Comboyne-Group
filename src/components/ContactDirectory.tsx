/**
 * Department contact table. A real <table> for screen readers; stacks into
 * labelled rows on narrow screens.
 */
import { locations, mailHref, telHref } from '../data/site';
import './ContactDirectory.css';

const rows = locations.flatMap((loc) =>
  loc.contacts.map((c) => ({ ...c, depot: `${loc.suburb}, ${loc.state}`, depotId: loc.id })),
);

export default function ContactDirectory() {
  return (
    <div className="directory">
      <table>
        <caption className="visually-hidden">Comboyne Group department contacts</caption>
        <thead>
          <tr>
            <th scope="col">Department</th>
            <th scope="col">Contact</th>
            <th scope="col">Phone</th>
            <th scope="col">Email</th>
            <th scope="col">Depot</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.department}>
              <th scope="row" data-label="Department">
                {row.department}
              </th>
              <td data-label="Contact">{row.name}</td>
              <td data-label="Phone">
                <a href={telHref(row.phone)}>{row.phone}</a>
              </td>
              <td data-label="Email">
                <a href={mailHref(row.email)}>{row.email}</a>
              </td>
              <td data-label="Depot">
                <a href={`/locations#${row.depotId}`}>{row.depot}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

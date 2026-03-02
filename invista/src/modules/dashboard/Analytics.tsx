import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../shared/ui/Header';
import Button from '../../shared/ui/Button';
import Select from '../../shared/ui/Select';
import Input from '../../shared/ui/Input';
import AnalyticsMockService from '../../shared/services/AnalyticsMockService';
import type { AnalyticsEvent } from '../../shared/services/AnalyticsMockService';

export default function Analytics() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<AnalyticsEvent[]>(() => AnalyticsMockService.getEvents().reverse());
  const [filterEvent, setFilterEvent] = useState('');
  const [filterFund, setFilterFund] = useState('');

  if (!import.meta.env.DEV) {
    return <Navigate to="/app" replace />;
  }

  const eventNames = Array.from(new Set(AnalyticsMockService.getEvents().map((e) => e.name)));

  const filtered = events.filter((ev) => {
    if (filterEvent && ev.name !== filterEvent) return false;
    if (filterFund && !JSON.stringify(ev.metadata).includes(filterFund)) return false;
    return true;
  });

  const handleClear = () => {
    AnalyticsMockService.clear();
    setEvents([]);
  };

  const refresh = () => {
    setEvents(AnalyticsMockService.getEvents().reverse());
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header variant="app" />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('analytics.title')}</h1>
            <p className="text-gray-500 mt-1">{t('analytics.subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={refresh}>↻ Refresh</Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>{t('analytics.clear')}</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-48">
            <Select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              label={t('analytics.filter_event')}
            >
              <option value="">{t('analytics.all_events')}</option>
              {eventNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Select>
          </div>
          <div className="w-48">
            <Input
              label={t('analytics.filter_fund')}
              placeholder="fund-slug"
              value={filterFund}
              onChange={(e) => setFilterFund(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{t('analytics.no_events')}</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wide text-xs">{t('analytics.event')}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wide text-xs">{t('analytics.timestamp')}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wide text-xs">{t('analytics.path')}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wide text-xs">{t('analytics.metadata')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filtered.map((ev) => (
                  <tr key={ev.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-primary-700 font-semibold">{ev.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(ev.ts).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{ev.path}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs max-w-xs">
                      {ev.metadata ? (
                        <pre className="whitespace-pre-wrap break-all">{JSON.stringify(ev.metadata, null, 2)}</pre>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

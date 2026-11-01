import { useEffect, useMemo, useState } from 'react'
import { initialFiles, initialShipments } from './data/mockData'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import './App.css'

const SHIPMENT_STORAGE_KEY = 'daladala-shipments-v1'
const FILE_STORAGE_KEY = 'daladala-files-v1'

const defaultForm = {
  trackingNumber: '',
  customer: '',
  origin: '',
  destination: '',
  status: 'In Transit',
  eta: '',
  notes: '',
}

const statusOptions = ['In Transit', 'Delayed', 'Delivered', 'Processing', 'At Hub']

function App() {
  const [shipments, setShipments] = useState(() => {
    const saved = localStorage.getItem(SHIPMENT_STORAGE_KEY)
    return saved ? JSON.parse(saved) : initialShipments
  })
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem(FILE_STORAGE_KEY)
    return saved ? JSON.parse(saved) : initialFiles
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [form, setForm] = useState(defaultForm)
  const [syncMessage, setSyncMessage] = useState('')

  useEffect(() => {
    localStorage.setItem(SHIPMENT_STORAGE_KEY, JSON.stringify(shipments))
  }, [shipments])

  useEffect(() => {
    localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(files))
  }, [files])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setSyncMessage('Local mode active: changes are saved in your browser only.')
      return
    }

    const syncShipments = async () => {
      try {
        const rows = shipments.map((shipment) => ({
          id: shipment.id,
          tracking_number: shipment.trackingNumber,
          customer: shipment.customer,
          origin: shipment.origin,
          destination: shipment.destination,
          status: shipment.status,
          eta: shipment.eta,
          notes: shipment.notes,
          last_updated: shipment.lastUpdated,
        }))

        const { error } = await supabase.from('shipments').upsert(rows)

        if (error) {
          throw error
        }

        setSyncMessage('Supabase connected and synced successfully.')
      } catch (error) {
        console.error('Supabase sync failed:', error)
        setSyncMessage('Supabase is configured but sync failed. Local data remains available.')
      }
    }

    syncShipments()
  }, [shipments])

  const filteredShipments = useMemo(() => {
    const value = searchTerm.trim().toLowerCase()

    if (!value) {
      return shipments
    }

    return shipments.filter((shipment) => {
      return (
        shipment.trackingNumber.toLowerCase().includes(value) ||
        shipment.customer.toLowerCase().includes(value) ||
        shipment.destination.toLowerCase().includes(value)
      )
    })
  }, [shipments, searchTerm])

  const summary = useMemo(() => {
    return {
      total: shipments.length,
      inTransit: shipments.filter((shipment) => shipment.status === 'In Transit').length,
      delayed: shipments.filter((shipment) => shipment.status === 'Delayed').length,
      delivered: shipments.filter((shipment) => shipment.status === 'Delivered').length,
    }
  }, [shipments])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const trackingNumber = form.trackingNumber.trim()
    const customer = form.customer.trim()
    const origin = form.origin.trim()
    const destination = form.destination.trim()

    if (!trackingNumber || !customer || !origin || !destination) {
      return
    }

    const newShipment = {
      id: `SHP-${Date.now()}`,
      trackingNumber,
      customer,
      origin,
      destination,
      status: form.status,
      eta: form.eta || 'TBD',
      notes: form.notes || 'Shipment created and waiting for dispatch confirmation.',
      lastUpdated: new Date().toISOString(),
    }

    setShipments((current) => [newShipment, ...current])
    setForm(defaultForm)
  }

  const handleStatusChange = (id, nextStatus) => {
    setShipments((current) =>
      current.map((shipment) =>
        shipment.id === id
          ? {
              ...shipment,
              status: nextStatus,
              lastUpdated: new Date().toISOString(),
            }
          : shipment,
      ),
    )
  }

  const handleRemoveShipment = (id) => {
    setShipments((current) => current.filter((shipment) => shipment.id !== id))
  }

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files || [])

    if (!uploadedFiles.length) {
      return
    }

    const mappedFiles = uploadedFiles.map((file) => ({
      id: `FILE-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toISOString(),
    }))

    setFiles((current) => [...mappedFiles, ...current])
    event.target.value = ''
  }

  const handleRemoveFile = (id) => {
    setFiles((current) => current.filter((file) => file.id !== id))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">DALADALA</p>
          <h1>Shipping Tracking System</h1>
        </div>
        <div className="status-pill">{syncMessage}</div>
      </header>

      <section className="summary-grid">
        <article className="summary-card">
          <span>Total Shipments</span>
          <strong>{summary.total}</strong>
        </article>
        <article className="summary-card highlight">
          <span>In Transit</span>
          <strong>{summary.inTransit}</strong>
        </article>
        <article className="summary-card warning">
          <span>Delayed</span>
          <strong>{summary.delayed}</strong>
        </article>
        <article className="summary-card success">
          <span>Delivered</span>
          <strong>{summary.delivered}</strong>
        </article>
      </section>

      <main className="content-grid">
        <section className="panel form-panel">
          <div className="panel-header">
            <h2>Add Shipment</h2>
          </div>

          <form onSubmit={handleSubmit} className="shipment-form">
            <label>
              Tracking number
              <input
                name="trackingNumber"
                value={form.trackingNumber}
                onChange={handleChange}
                placeholder="TRK-2026-0001"
              />
            </label>

            <label>
              Customer
              <input
                name="customer"
                value={form.customer}
                onChange={handleChange}
                placeholder="Customer name"
              />
            </label>

            <div className="two-column">
              <label>
                Origin
                <input
                  name="origin"
                  value={form.origin}
                  onChange={handleChange}
                  placeholder="From"
                />
              </label>

              <label>
                Destination
                <input
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="To"
                />
              </label>
            </div>

            <div className="two-column">
              <label>
                Status
                <select name="status" value={form.status} onChange={handleChange}>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                ETA
                <input type="date" name="eta" value={form.eta} onChange={handleChange} />
              </label>
            </div>

            <label>
              Notes
              <textarea
                name="notes"
                rows="4"
                value={form.notes}
                onChange={handleChange}
                placeholder="Shipment notes and route details"
              />
            </label>

            <button type="submit" className="primary-button">
              Save shipment
            </button>
          </form>
        </section>

        <section className="panel records-panel">
          <div className="panel-header split-header">
            <h2>Shipment Records</h2>
            <input
              type="search"
              aria-label="Search shipments"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by customer or tracking"
            />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tracking</th>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>ETA</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>{shipment.trackingNumber}</td>
                    <td>{shipment.customer}</td>
                    <td>
                      {shipment.origin} → {shipment.destination}
                    </td>
                    <td>
                      <select
                        value={shipment.status}
                        onChange={(event) => handleStatusChange(shipment.id, event.target.value)}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{shipment.eta}</td>
                    <td>
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => handleRemoveShipment(shipment.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <section className="panel file-panel">
        <div className="panel-header split-header">
          <h2>File Management</h2>
          <label className="upload-button">
            <input type="file" multiple onChange={handleFileUpload} />
            Upload files
          </label>
        </div>

        <div className="file-list">
          {files.map((file) => (
            <div key={file.id} className="file-item">
              <div>
                <strong>{file.name}</strong>
                <span>
                  {file.size} • {new Date(file.uploadedAt).toLocaleDateString()}
                </span>
              </div>
              <button type="button" className="ghost-button" onClick={() => handleRemoveFile(file.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App

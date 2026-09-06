import { useState } from "react";
import { Plus } from "lucide-react";

import { Header } from "../components/Layout/Header";
import { PageContainer } from "../components/Layout/PageContainer";
import { Tabs } from "../components/Layout/Tabs";

import { RelationsSearchInput } from "../components/Network/RelationsSearchInput";
import { CompanyList } from "../components/Network/CompanyList";
import { ContactsList } from "../components/Network/ContactsList";

import { CompanyForm } from "../components/Network/CompanyForm";
import { ContactForm } from "../components/Network/ContactForm";

import type { Company } from "../types/company.types";
import type { Contact } from "../types/contact.types";
import type { CompanyFormData } from "../schemas/company.schemas";
import type { ContactFormData } from "../schemas/contact.schemas";

export function Network() {
  const [activeTab, setActiveTab] = useState<"companies" | "contacts">(
    "companies",
  );

  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [query, setQuery] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const companyNameById = Object.fromEntries(
    companies.map((company) => [company.id, company.name]),
  );

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(query.toLowerCase()),
  );

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(query.toLowerCase()),
  );

  function deleteContact(id: number) {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  }

  function createCompany(data: CompanyFormData) {
    const newCompany: Company = {
      id: Math.max(0, ...companies.map((c) => c.id)) + 1,
      name: data.name,
      businessSector: data.businessSector,
      website: data.website || null,
      address: data.address || null,
      contactsCount: 0,
      candidaturesCount: 0,
      latestApplicationStatus: null,
    };
    setCompanies((prev) => [...prev, newCompany]);
    setShowForm(false);
  }

  function submitContact(data: ContactFormData) {
    if (editingContact) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingContact.id
            ? { ...c, ...data, phone: data.phone || null }
            : c,
        ),
      );
    } else {
      const newContact: Contact = {
        id: Math.max(0, ...contacts.map((c) => c.id)) + 1,
        ...data,
        phone: data.phone || null,
      };
      setContacts((prev) => [...prev, newContact]);
    }
    setShowForm(false);
  }

  return (
    <>
      <Header />

      <PageContainer className="py-3 space-y-3">
        <Tabs
          items={[
            { key: "companies", label: "Entreprises" },
            { key: "contacts", label: "Contacts" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
          variant="onPage"
        />

        <RelationsSearchInput value={query} onChange={setQuery} />

        {activeTab === "companies" ? (
          <CompanyList companies={filteredCompanies} />
        ) : (
          <ContactsList
            contacts={filteredContacts}
            companyNameById={companyNameById}
            onEdit={(contact) => {
              setEditingContact(contact);
              setShowForm(true);
            }}
            onDelete={deleteContact}
          />
        )}

        <button
          className="btn btn-primary w-11 h-11 rounded-full p-0 mx-auto flex items-center justify-center gap-2 sm:mx-0 sm:w-full sm:h-auto sm:rounded-btn sm:p-2"
          onClick={() => {
            setEditingContact(null);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          <span className="hidden sm:inline">
            {activeTab === "companies"
              ? "Ajouter une entreprise"
              : "Ajouter un contact"}
          </span>
        </button>

        {showForm &&
          (activeTab === "companies" ? (
            <CompanyForm
              onClose={() => setShowForm(false)}
              onSubmit={createCompany}
            />
          ) : (
            <ContactForm
              initialData={editingContact}
              companies={companies}
              onClose={() => setShowForm(false)}
              onSubmit={submitContact}
            />
          ))}
      </PageContainer>
    </>
  );
}

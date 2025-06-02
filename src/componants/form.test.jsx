import { render, screen, fireEvent } from '@testing-library/react';
import Form from './form';

//npm install --save-dev @testing-library/react @testing-library/jest-dom

// Mock du fichier JSON
jest.mock('../schema/form_schema.json', () => ({
  title: "AI Project Form",
  fields: [
    { name: "firstName", label: "First Name", type: "text", placeholder: "First Name" },
    { name: "lastName", label: "Last Name", type: "text", placeholder: "Last Name" },
    { name: "Manager", label: "Project Manager", type: "text", placeholder: "Project Manager Name" },
    { name: "date", label: "Date", type: "date", placeholder: "Date" },
    { name: "Sig", label: "Sigle", type: "text", placeholder: "Sigle" },
    { name: "projectName", label: "Project Name", type: "text", placeholder: "Project Name" }
  ],
  fieldDescriptions: [
    { name: "description", label: "Description", type: "textarea", placeholder: "Project Description" }
  ],
  roles: [
    { label: "1 - I am deploying a project internally or externally (Deployer)", value: "Deployer" },
    { label: "2 - I am developing a tool for MBDA or a client (Provider)", value: "Provider" },
    { label: "3 - I am reselling an AI solution (Importer)", value: "Importer" }
  ],
  checkboxes: [
    {
      id: "context",
      label: "Does your project relate to any of the following contexts?",
      options: [
        { id: "1", label: "Subliminal techniques" },
        { id: "2", label: "Exploring vulnerabilities" },
        { id: "3", label: "Biometric categorisation" }
      ]
    },
    {
      id: "sector",
      label: "Sectors involved",
      options: [
        { id: "1", label: "Defense" },
        { id: "2", label: "Healthcare" },
        { id: "3", label: "Finance" }
      ]
    }
  ],
  radioQuestions: {
    usesAI: "Does your project use AI?",
    automatedDecision: "Does your project include automated decision-making?"
  }
}));

describe('Form Validation', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('affiche des erreurs si les champs sont vides', () => {
    render(<Form />);
    fireEvent.click(screen.getByText(/submit/i));

    expect(screen.getByText(/First Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Project Manager is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Sigle is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Project Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Please select a role/i)).toBeInTheDocument();
  });

  test('envoie les données quand le formulaire est valide', () => {
    render(<Form />);

    fireEvent.change(screen.getByPlaceholderText(/First Name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText(/Last Name/i), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByPlaceholderText(/Project Manager Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText(/Date/i), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByPlaceholderText(/Sigle/i), { target: { value: 'AI01' } });
    fireEvent.change(screen.getByPlaceholderText(/Project Name/i), { target: { value: 'AI Tool' } });
    fireEvent.change(screen.getByPlaceholderText(/Project Description/i), { target: { value: 'This is a test project' } });

    fireEvent.click(screen.getByLabelText(/Deployer/i));
    //fireEvent.click(screen.getByLabelText(/Subliminal techniques/i));
    //fireEvent.click(screen.getByLabelText(/Defense/i));

    expect(screen.getByText(/Does your project use AI\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Does your project include automated decision-making\?/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/submit/i));

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Alice'));
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('AI Tool'));
  });

  test('affiche une erreur si aucun rôle n\'est sélectionné', () => {
    render(<Form />);
    fireEvent.change(screen.getByPlaceholderText(/First Name/i), { target: { value: 'Bob' } });
    fireEvent.click(screen.getByText(/submit/i));
    expect(screen.getByText(/Please select a role/i)).toBeInTheDocument();
  });
});

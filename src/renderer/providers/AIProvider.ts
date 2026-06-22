export interface GenerateEmailRequest {
  prompt: string
  tone: string
}

export interface GeneratedEmail {
  subject: string
  body: string
}

export interface AIProvider {
  id: string
  name: string
  generateEmail(request: GenerateEmailRequest): Promise<GeneratedEmail>
}

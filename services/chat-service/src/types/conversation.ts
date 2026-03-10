interface Conversation {
      id: string
      title: string | null
      participantIds: string[]
      createdAt: Date
      updatedAt: Date
      lastMessageAt: Date | null
      lastMesagePreview: Date | null
}
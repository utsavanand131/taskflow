export function getTaskAccessWhere(userId: string) {
  return {
    OR: [
      {
        ownerId: userId,
      },
      {
        team: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    ],
  };
}

export const taskInclude = {
  project: {
    include: {
      owner: true,
      team: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  },

  assignee: true,

  comments: {
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "asc" as const,
    },
  },

  labels: {
    orderBy: {
      name: "asc" as const,
    },
  },

  attachments: {
    include: {
      uploadedBy: true,
    },
    orderBy: {
      createdAt: "desc" as const,
    },
  },

  checklist: {
    include: {
      createdBy: true,
    },
    orderBy: {
      createdAt: "asc" as const,
    },
  },
};

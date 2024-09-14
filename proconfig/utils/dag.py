from collections import defaultdict, deque
import time
from pydantic import BaseModel, Field
from typing import List, Dict

class DAG(BaseModel):
    graph: Dict[str, List[str]] = Field(defaultdict(list))
    in_degree: Dict[str, int] = Field(defaultdict(int))
    top_order: List[str] = Field([])
    
    def __init__(self):
        super().__init__()

    def add_edge(self, u, v):
        self.graph[u].append(v)
        self.in_degree[v] += 1

    def topological_sort(self):
        zero_in_degree_queue = deque([u for u in self.graph if self.in_degree[u] == 0])
        top_order = []

        while zero_in_degree_queue:
            u = zero_in_degree_queue.popleft()
            top_order.append(u)

            for v in self.graph[u]:
                self.in_degree[v] -= 1
                if self.in_degree[v] == 0:
                    zero_in_degree_queue.append(v)

        if len(top_order) == len(self.graph):
            self.top_order = top_order
        else:
            raise Exception("The graph has at least one cycle.")

    def execute_task(self, task):
        print(f"Starting task {task}")
        time.sleep(1)  # Simulating task execution time
        print(f"Finished task {task}")
import pandas as pd


def transform_sources(sources):

    def extract_sources_from_string(s):
        #Incoming string:
        #{ fuentes: [Lipschutz, S. (1973). Teoría de conjuntos y temas afines. McGraw Hill. (Recomendado por UDG)] }
        #Expected output:
        #[Lipschutz, S. (1973). Teoría de conjuntos y temas afines. McGraw Hill. (Recomendado por UDG)]
        s = s.replace("{ fuentes: ", "").replace("}", "")
        print(s)
        return s

    sources_list = sources.apply(extract_sources_from_string)
    print(sources_list)
    return sources_list


data = pd.read_csv("dataset2.csv")

sources = transform_sources(data["sources"])

# replace the sources column with the new sources list

data["sources"] = sources

data.to_csv("dataset.csv", index=False)



print("Done")